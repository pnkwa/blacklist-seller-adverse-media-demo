import classNames from 'classnames'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'components/base/Table'
import {
  kycNotPassedOverviewTableSpecs,
  pendingClientOverviewTableSpecs,
} from 'specs/overviewTableSpecs'
import { Tabs } from 'components/base/Tabs'
import { useFlows } from 'hooks/useFlows'
import { getCurrentPage, setCurrentPage } from 'reducers'
import { routes } from 'config/routes'
import { FlowTableTabItemConfig, FlowsResultKey } from 'types/caseKeeperCore'
import { useFlowTableTabs } from 'hooks/useFlowTableTabs'
import { Pagination } from '../Pagination'
import { SeeDetailsButton } from './SeeDetailsButton'

interface OverviewTableProps {
  className?: string
}

export const OverviewTable = ({ className }: OverviewTableProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const page = useSelector(getCurrentPage)

  const blocked = useFlows(FlowsResultKey.BLOCKED)
  const pendingClient = useFlows(FlowsResultKey.PENDING_CLIENT)
  const prevPeriod = useFlows(FlowsResultKey.PREVIOUS_PERIOD)
  const all = useFlows(FlowsResultKey.ALL)
  const pendingOperation = useFlows(FlowsResultKey.PENDING_OPERATION)
  const completed = useFlows(FlowsResultKey.COMPLETED)
  const verified = useFlows(FlowsResultKey.VERIFIED)

  const tabsConfig = useMemo(
    (): FlowTableTabItemConfig[] => [
      {
        key: FlowsResultKey.BLOCKED,
        label: 'flowTable.tab.blocked',
        count: blocked.count,
        tableSpecs: kycNotPassedOverviewTableSpecs,
      },
      {
        key: FlowsResultKey.PENDING_CLIENT,
        label: 'flowTable.tab.pendingClient',
        count: pendingClient.count,
        tableSpecs: pendingClientOverviewTableSpecs,
      },
    ],
    [pendingClient.count, blocked.count]
  )

  const { currentTab, setCurrentTab, currentTabConfig, currentResult } =
    useFlowTableTabs(tabsConfig, FlowsResultKey.BLOCKED)

  /** initial load flow count when opened the page + handle change tab + change page */
  useEffect(() => {
    if (currentResult.key !== blocked.key) blocked.loadData(1)
    if (currentResult.key !== pendingClient.key) pendingClient.loadData(1)
    prevPeriod.loadData(1)
    all.loadData(1)
    pendingOperation.loadData(1)
    completed.loadData(1)
    verified.loadData(1)
    currentResult.loadData(undefined, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    currentResult.loadData,
    blocked.loadData,
    pendingClient.loadData,
    prevPeriod.loadData,
    all.loadData,
    pendingOperation.loadData,
    completed.loadData,
    verified.loadData,
  ])

  return (
    <div
      className={classNames(
        'content-box px-0 space-y-2 max-h-[calc(100vh-)] h-full w-full flex flex-col overflow-hidden',
        className
      )}
    >
      <div className="px-6 mb-2 flex space-x-4 justify-between">
        <span className="font-bold">
          {t('overviewPage.candidatesBox.title')}
        </span>
        <SeeDetailsButton
          onClick={() => {
            const search = new URLSearchParams({ tab: currentTab })
            navigate(`${routes.backgroundCheck}?${search}`)
          }}
        />
      </div>
      <div className="w-full overflow-hidden px-6">
        <Tabs
          tabsConfig={tabsConfig}
          activeTab={currentTab}
          onChangeTab={(tab) => {
            setCurrentTab(tab)
            dispatch(setCurrentPage(1))
          }}
          showCount
        />
      </div>
      <div className="px-6 flex-1 overflow-x-auto">
        <Table
          key={currentTab}
          data={currentResult.data}
          loading={currentResult.loading}
          error={currentResult.error}
          tableSpecs={currentTabConfig.tableSpecs}
          onSelectRow={(flow) => {
            navigate(routes.caseDetail.replace(':id', flow.id))
          }}
          theadClassName="hidden"
          tableClassName="table-pin-rows sm:min-w-max"
          tdClassName="px-0 pt-0 pb-2 sm:pb-4 sm:pt-4 sm:px-4"
          rowClassName="grid grid-cols-2 py-2 sm:table-row sm:py-0"
        />
      </div>
      {currentResult.meta && (
        <div id="pagination" className="w-full px-6 pt-2">
          <Pagination
            meta={currentResult.meta}
            page={page}
            onChange={(p) => dispatch(setCurrentPage(p))}
          />
        </div>
      )}
    </div>
  )
}
