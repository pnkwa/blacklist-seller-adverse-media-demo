import { useCallback, useMemo, useRef, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { t } from 'i18next'
import DownloadIcon from 'assets/svg/icon-result-report.svg?react'
import { useOnClickOutside } from 'hooks/clickOutside'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { SpreadsheetMimetype } from 'types/generic/spreadsheet'
import { downloadSpreadSheet } from 'utils/download'
import { dateFormats } from 'config/dateFormats'
import { useFlowsResultMap } from 'hooks/useFlowsResultMap'
import { FlowTableTabItemConfig, FlowsResultKey } from 'types/caseKeeperCore'
import { backgroundCheckMainTabs } from 'specs/bgcTabs'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { useFlowTableTabs } from 'hooks/useFlowTableTabs'
import {
  getColumnSettings,
  getFilterCreatedAtRange,
  getFilterPopup,
  getSortOrder,
} from 'reducers'
import { getCreatedAtFilter } from 'utils/filter'
import { mapStreamToArray } from 'utils/stream'
import { logger } from 'utils/logger'
import { resultReportMapping } from 'helpers/export'
import { getQueryParamsFilter } from 'utils/dashboardFilter'
import { dashboardFilterFieldConfig } from 'config/filter'
import { proprietorSearchableFieldConfigs } from 'config/searchFields'
import { getDefaultDisplayColumn } from 'utils/backgroundCheck'
import { checkPermissions } from 'utils/permission'
import { exportResultReportPrms } from 'config/permission'
import { SpreadSheetFormatDropdown } from '../SpreadSheetFormat'

export const ActionDownload = () => {
  const { fetchFlowsGroupedByProprietor, permissions } = useCaseKeeperContext()
  const { resultsCountMap } = useFlowsResultMap()
  const { client } = useTenantConfigContext()
  const { filter, searched } = useSelector(getFilterPopup)
  const createdAtFilterValue = useSelector(getFilterCreatedAtRange)
  const columnSettings = useSelector(getColumnSettings)
  const sortOrder = useSelector(getSortOrder)
  const [isReportLoading, setIsReportLoading] = useState(false)
  const [showSpreadsheetFormat, setShowSpreadsheetFormat] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const menuRef = useRef<HTMLUListElement>(null)

  const permissionActionDownload = useMemo(
    () => checkPermissions(exportResultReportPrms, permissions),
    [permissions]
  )

  const tabsConfig = useMemo(
    (): FlowTableTabItemConfig[] =>
      backgroundCheckMainTabs.map((item) => ({
        ...item,
        tableSpecs: item.tableSpecs(client),
        count: resultsCountMap[item.key],
      })),
    [client, resultsCountMap]
  )

  const { currentTab, currentTabConfig } = useFlowTableTabs(
    tabsConfig,
    FlowsResultKey.ALL
  )

  const filteredTableSpecs = currentTabConfig.tableSpecs.filter(
    (col) => columnSettings?.[col.key] ?? getDefaultDisplayColumn(col.key)
  )

  const currentDashboardTab = useMemo(
    () =>
      dashboardFilterFieldConfig.find(
        (tab) => tab.key === FlowsResultKey.ALL
      ) ?? dashboardFilterFieldConfig[0],
    []
  )

  const searchableFieldConfig = proprietorSearchableFieldConfigs.filter(
    (item) =>
      currentDashboardTab
        ?.getSearchFieldKeys(client)
        ?.includes(item.tenantSearchField)
  )

  const queryParamsFilter = getQueryParamsFilter(
    client,
    currentDashboardTab,
    searchableFieldConfig,
    { filter, searched }
  )

  const fetchAllProprietorFlowStream =
    useCallback(async (): Promise<ReadableStream<Uint8Array> | null> => {
      if (!currentTab) return null

      return fetchFlowsGroupedByProprietor(
        {
          ...queryParamsFilter,
          ...getCreatedAtFilter(createdAtFilterValue),
        },
        sortOrder,
        1,
        'unlimited'
      ) as unknown as ReadableStream<Uint8Array>
    }, [
      createdAtFilterValue,
      currentTab,
      fetchFlowsGroupedByProprietor,
      queryParamsFilter,
      sortOrder,
    ])

  const generateReport = useCallback(
    (mimetype: SpreadsheetMimetype) => () =>
      fetchAllProprietorFlowStream()
        .then(async (stream) => {
          if (!stream) return
          setIsReportLoading(true)

          const filename = `${moment().format(
            dateFormats.compactISODate
          )}_Result_Report.${mimetype === 'text/csv' ? 'csv' : 'xlsx'}`

          const data = await mapStreamToArray(
            stream,
            resultReportMapping(filteredTableSpecs)
          )

          downloadSpreadSheet(data, filename, mimetype)
        })
        .catch((err) => logger.error(err))
        .finally(() => setIsReportLoading(false)),
    [fetchAllProprietorFlowStream, filteredTableSpecs]
  )

  useOnClickOutside(menuRef, () => {
    setShowMenu(false)
    setShowSpreadsheetFormat(false)
  })

  if (!permissionActionDownload) return null

  return (
    <div>
      <button
        id="action-download-button"
        type="button"
        onClick={() => setShowMenu(true)}
        aria-label="Download Report"
        className={classNames(
          'btn btn-sm btn-circle btn-ghost w-9 h-9 xs+:w-12 xs+:h-12',
          'flex items-center justify-center',
          showMenu && 'active'
        )}
      >
        <DownloadIcon />
      </button>
      <ul
        ref={menuRef}
        className={classNames(
          'shadow-md w-72 z-20 absolute right-0 py-2',
          'bg-base-100 rounded-md whitespace-nowrap text-base-content text-sm',
          showMenu ? 'block' : 'hidden'
        )}
      >
        {permissionActionDownload && (
          <li className="relative px-2">
            <button
              type="button"
              onClick={() => setShowSpreadsheetFormat((prev) => !prev)}
              disabled={isReportLoading}
              className={classNames(
                'btn w-full bg-white shadow-none border-none',
                isReportLoading ? 'btn-disabled' : ''
              )}
            >
              <p className="font-normal">{t('generic.downloadResultReport')}</p>
              <FontAwesomeIcon icon={faCaretRight} className="ml-auto" />
            </button>
            {showSpreadsheetFormat && (
              <SpreadSheetFormatDropdown
                onExport={generateReport}
                className="-left-12 -top-14"
              />
            )}
          </li>
        )}
      </ul>
    </div>
  )
}
