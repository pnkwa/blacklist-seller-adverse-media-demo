import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import { Tabs } from 'components/base/Tabs'
import {
  getColumnSettings,
  getCurrentPage,
  getSortOrder,
  setCurrentPage,
  setSortOrder,
} from 'reducers'
import { UseFlowsReturn, useFlows } from 'hooks/useFlows'
import { Table } from 'components/base/Table'
import { routes } from 'config/routes'
import {
  Flow,
  FlowTableTabItemConfig,
  FlowsResultKey,
} from 'types/caseKeeperCore'
import { useFlowTableTabs } from 'hooks/useFlowTableTabs'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { backgroundCheckMainTabs, receivedSubTabs } from 'specs/bgcTabs'
import { useFlowsResultMap } from 'hooks/useFlowsResultMap'
import { getDefaultDisplayColumn } from 'utils/backgroundCheck'
import { useDownloadZip } from 'hooks/useDownloadZip'
import { Pagination } from '../Pagination'
import { ColumnSettings } from './ColumnSettings'
import { ActionDownload } from './ActionDownload'
import { ActionBar } from './ActionBar'

export const BackgroundCheckTable = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { client } = useTenantConfigContext()

  const page = useSelector(getCurrentPage)
  const sortOrder = useSelector(getSortOrder)
  const columnSettings = useSelector(getColumnSettings)

  const all = useFlows(FlowsResultKey.ALL)
  const pendingClient = useFlows(FlowsResultKey.PENDING_CLIENT)
  const blocked = useFlows(FlowsResultKey.BLOCKED)
  const pendingOperation = useFlows(FlowsResultKey.PENDING_OPERATION)
  const received = useFlows(FlowsResultKey.RECEIVED)
  const completed = useFlows(FlowsResultKey.COMPLETED)
  const verified = useFlows(FlowsResultKey.VERIFIED)
  const onDownloadZip = useDownloadZip()

  const { resultsMap, resultsCountMap } = useFlowsResultMap()
  const [flows, setFlows] = useState<Flow[]>([])
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([])

  const onCheckItem = useCallback((flows, index, checked) => {
    setCheckedIndexes((ci) =>
      checked ? ci.concat(index) : ci.filter((idx) => idx !== index)
    )
    setFlows((prev) => {
      if (!checked) return prev.filter((flow) => flow !== flows)
      return prev.some((flow) => flow === flows) ? prev : prev.concat(flows)
    })
  }, [])

  const tabsConfig = useMemo(
    (): FlowTableTabItemConfig[] =>
      backgroundCheckMainTabs.map((item) => ({
        ...item,
        tableSpecs: item.tableSpecs(client),
        count: resultsCountMap[item.key],
      })),
    [client, resultsCountMap]
  )

  const subTabsConfig = useMemo(
    (): FlowTableTabItemConfig[] =>
      receivedSubTabs.map((item) => ({
        ...item,
        tableSpecs: [],
        count: resultsCountMap[item.key],
      })),
    [resultsCountMap]
  )

  const { currentTab, currentTabConfig, currentResult, setCurrentTab } =
    useFlowTableTabs(tabsConfig, FlowsResultKey.ALL)

  const {
    currentTab: currentSubTab,
    currentResult: currentSubResult,
    setCurrentTab: setCurrentSubTab,
  } = useFlowTableTabs(subTabsConfig, FlowsResultKey.RECEIVED, 'subtab')

  const isReceivedTab = currentTab === FlowsResultKey.RECEIVED
  const tableResult = isReceivedTab ? currentSubResult : currentResult

  const filteredTableSpecs = currentTabConfig.tableSpecs.filter(
    (col) => columnSettings?.[col.key] ?? getDefaultDisplayColumn(col.key)
  )

  /**
   * load all tabs' flow count when opened the page + change tab
   * except for the current tab, which will be loaded via the another useEffect below instead
   */
  useEffect(() => {
    const loadResult = (result: UseFlowsReturn) =>
      result.key !== tableResult.key && result.loadData(1)
    tabsConfig.forEach((tab) => loadResult(resultsMap[tab.key]))
    if (isReceivedTab)
      subTabsConfig.forEach((tab) => loadResult(resultsMap[tab.key]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    all.loadData,
    pendingClient.loadData,
    blocked.loadData,
    pendingOperation.loadData,
    received.loadData,
    completed.loadData,
    verified.loadData,
    tableResult.key,
  ])

  /** load current tab's flows when change tab + page + order */
  useEffect(() => {
    tableResult.loadData(undefined, page, sortOrder)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableResult.loadData, page, sortOrder])

  const onClear = () => {
    setFlows([])
    setCheckedIndexes([])
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative">
      <div className="w-full flex space-x-4 px-6">
        <div className="flex-1 overflow-hidden">
          <Tabs
            tabsConfig={tabsConfig}
            activeTab={currentTab}
            onChangeTab={(tab) => {
              setCurrentTab(tab, { clearParams: ['subtab'] })
              dispatch(setCurrentPage(1))
            }}
            showCount
          />
        </div>
        <div className="hidden flex items-center sm:flex min-w-0 ">
          <ColumnSettings />
          {currentTab === FlowsResultKey.ALL && <ActionDownload />}
        </div>
      </div>
      {isReceivedTab && (
        <div className="w-full overflow-hidden px-6">
          <Tabs
            tabsConfig={subTabsConfig}
            activeTab={currentSubTab}
            onChangeTab={(tab) => {
              setCurrentSubTab(tab)
              dispatch(setCurrentPage(1))
            }}
            showCount
            className="pt-4"
            tabClass={classNames(
              'grid grid-cols-[auto_auto] grid-rows-[auto_auto] gap-x-3 !h-auto py-3 pr-6 rounded-t-xl',
              'text-left !border-b-0'
            )}
            activeTabClass="bg-base-content !text-base-100 !font-normal"
            renderIcon={(tab, isActive) =>
              tab.icon && (
                <div
                  className={classNames(
                    'row-span-2 bg-base-100 rounded-full w-12 h-12 flex items-center justify-center',
                    isActive
                      ? 'text-base-content bg-base-100'
                      : `text-${tab.color} bg-${tab.color} bg-opacity-20`
                  )}
                >
                  {tab.icon}
                </div>
              )
            }
            renderCount={(tab, isActive) => (
              <div
                className={classNames(
                  'text-2xl -mt-2',
                  isActive ? '!text-base-100' : `text-${tab.color}`
                )}
              >
                {tab.count ?? '...'}
              </div>
            )}
          />
        </div>
      )}
      <div className="px-6 flex-1 overflow-x-auto">
        <Table
          key={isReceivedTab ? currentSubTab : currentTab}
          data={tableResult.data}
          loading={tableResult.loading}
          tableSpecs={
            filteredTableSpecs.length
              ? filteredTableSpecs
              : currentTabConfig.tableSpecs
          }
          sortOrder={sortOrder}
          checkedIndexes={checkedIndexes}
          hasCheckbox
          onSort={(order) => dispatch(setSortOrder(order))}
          onCheckItem={onCheckItem}
          onSelectRow={(flow) => {
            navigate(routes.caseDetail.replace(':id', flow.id))
          }}
          tableClassName="table-pin-rows"
          theadClassName="hidden sm:table-header-group"
          rowClassName="flex flex-wrap justify-between items-center py-2 sm:table-row sm:py-0"
          tdClassName="px-0 py-2 sm:pb-4 sm:py-4 sm:px-4"
        />
      </div>

      {tableResult.meta && (
        <div id="pagination" className="w-full px-6 pt-2">
          <Pagination
            meta={tableResult.meta}
            page={page}
            onChange={(p) => dispatch(setCurrentPage(p))}
          />
        </div>
      )}
      {!!flows.length && (
        <ActionBar
          length={flows.length}
          title="bulkSelected.selected"
          onDownloadZip={() => onDownloadZip({ flows, onClear })}
          onCancel={onClear}
        />
      )}
    </div>
  )
}
