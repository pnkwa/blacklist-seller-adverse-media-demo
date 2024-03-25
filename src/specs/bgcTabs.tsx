import FileIcon from 'assets/svg/icon-document.svg?react'
import ErrorIcon from 'assets/svg/status/error.svg?react'
import CheckIcon from 'assets/svg/status/success.svg?react'
import { Flow, FlowsResultKey } from 'types/caseKeeperCore'
import { filterColumns } from 'utils/table'
import { Client } from 'types/tenantConfig'
import { TableSpec } from 'types/generic/table'
import {
  allBGCTableSpecs,
  blockedBGCTableSpecs,
  pendingClientBGCTableSpecs,
  pendingOperationBGCTableSpecs,
  receivedBGCTableSpecs,
} from './bgcTableSpecs'

interface MainTabSpec {
  key: FlowsResultKey
  label: string
  tableSpecs: (client: Client) => TableSpec<Flow>[]
}

interface SubTabSpec {
  key: FlowsResultKey
  label: string
  icon?: React.ReactNode
  color?: string
}

export const backgroundCheckMainTabs: MainTabSpec[] = [
  {
    key: FlowsResultKey.ALL,
    label: 'flowTable.tab.all',
    tableSpecs: (client) =>
      filterColumns(
        allBGCTableSpecs,
        client.backgroundCheckDashboardConfig?.displayTotalCaseFlowColumns
      ),
  },
  {
    key: FlowsResultKey.PENDING_CLIENT,
    label: 'flowTable.tab.pendingClient',
    tableSpecs: (client) =>
      filterColumns(
        pendingClientBGCTableSpecs,
        client.backgroundCheckDashboardConfig
          ?.displayPendingClientCaseFlowColumns
      ),
  },
  {
    key: FlowsResultKey.BLOCKED,
    label: 'flowTable.tab.blocked',
    tableSpecs: (client) =>
      filterColumns(
        blockedBGCTableSpecs,
        client.backgroundCheckDashboardConfig?.displayKycNotVerifiedFlowColumns
      ),
  },
  {
    key: FlowsResultKey.PENDING_OPERATION,
    label: 'flowTable.tab.pendingOperation',
    tableSpecs: (client) =>
      filterColumns(
        pendingOperationBGCTableSpecs,
        client.backgroundCheckDashboardConfig?.displayPendingResultFlowColumns
      ),
  },
  {
    key: FlowsResultKey.RECEIVED,
    label: 'flowTable.tab.received',
    tableSpecs: (client) =>
      filterColumns(
        receivedBGCTableSpecs,
        client.backgroundCheckDashboardConfig?.displayReceivedResultFlowColumns
      ),
  },
]

export const receivedSubTabs: SubTabSpec[] = [
  {
    key: FlowsResultKey.RECEIVED,
    label: 'flowTable.receivedTab.all',
    icon: <FileIcon />,
    color: 'neutral',
  },
  {
    key: FlowsResultKey.VERIFIED,
    label: 'flowTable.receivedTab.verified',
    icon: (
      <div className="bg-current rounded-full w-6 h-6 flex items-center justify-center">
        <CheckIcon className="text-base-100" />
      </div>
    ),
    color: 'success',
  },
  {
    key: FlowsResultKey.COMPLETED,
    label: 'flowTable.receivedTab.completed',
    icon: (
      <div className="bg-current rounded-full w-6 h-6 flex items-center justify-center">
        <ErrorIcon className="text-base-100" />
      </div>
    ),
    color: 'warning',
  },
]
