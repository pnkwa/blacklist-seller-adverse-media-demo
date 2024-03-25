import { t } from 'i18next'
import { Flow } from 'types/caseKeeperCore'
import { TableSpec } from 'types/generic/table'
import { BackgroundCheckStatus } from 'types/bgcCore'
import { KYCFailedReasons } from 'components/composite/FlowTable/KYCFailedReasons'
import { EvaluationResultLabel } from 'components/composite/FlowTable/EvaluationResultLabel'
import { RequiredProcesses } from 'components/composite/FlowTable/RequiredProcesses'
import { ResultProgress } from 'components/composite/FlowTable/ResultProgress'
import { getDisplayedBackgroundCheckStatus } from 'utils/backgroundCheck'
import { LatestClientProcess } from 'components/composite/FlowTable/LatestClientProcess'
import { ResultOverview } from 'components/composite/FlowTable/ResultOverview'
import { FlowTags } from 'components/composite/FlowTable/FlowTags'
import { getLatestClientProcess } from 'utils/flow'
import {
  createdAtColumn,
  nameColumn,
  contactColumn,
  positionColumn,
  expiryLabelColumn,
  latestClientProcessColumn,
  resendLinkColumn,
  citizenIdColumn,
  updatedAtColumn,
  expiresAtColumn,
  statusColumn,
  failedReasonsColumn,
  completedAtColumn,
} from './commonColumns'

const tags: TableSpec<Flow> = {
  key: 'tags',
  header: 'flowTable.header.tags',
  headerClassName: 'text-center min-w-[200px]',
  getRawValue: (item) => item.tags?.join(', ') ?? '-',
  renderValue: (item) => <FlowTags flow={item} />,
}

const ownerEmail: TableSpec<Flow> = {
  key: 'ownerEmail',
  header: 'flowTable.header.ownerEmail',
  headerClassName: 'text-center min-w-[250px]',
  contentClassName: 'text-center',
  hiddenOnMobile: true,
  renderValue: (item) => item.user?.email ?? '-',
}

const details: TableSpec<Flow> = {
  key: 'details',
  header: 'flowTable.header.details',
  headerClassName: 'min-w-[400px]',
  contentClassName: 'w-full sm:w-auto sm:flex justify-between sm:table-cell',
  getRawValue: (item) =>
    t(`latestClientProcess.${getLatestClientProcess(item)}`) ?? '-',
  renderValue: (item) => {
    const status = getDisplayedBackgroundCheckStatus(item.backgroundCheck)
    switch (status) {
      case BackgroundCheckStatus.OPEN:
      case BackgroundCheckStatus.PENDING_CLIENT:
      case BackgroundCheckStatus.EXPIRED:
        return <LatestClientProcess flow={item} />
      case BackgroundCheckStatus.BLOCKED:
        return <KYCFailedReasons flow={item} maxDisplayItems={2} />
      case BackgroundCheckStatus.PENDING_OPERATION:
        return <ResultProgress flow={item} />
      case BackgroundCheckStatus.VERIFIED:
      case BackgroundCheckStatus.COMPLETED:
        return <EvaluationResultLabel flow={item} />
      default:
        return null
    }
  },
}

export const allBGCTableSpecs: TableSpec<Flow>[] = [
  nameColumn({ headerClassName: 'min-w-[250px]', contentClassName: 'flex-1' }),
  citizenIdColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  positionColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  contactColumn({ headerClassName: 'min-w-[170px]', hiddenOnMobile: true }),
  createdAtColumn({ headerClassName: 'min-w-[140px]', hiddenOnMobile: true }),
  updatedAtColumn({
    headerClassName: 'min-w-[140px]',
    hiddenOnMobile: true,
  }),
  expiresAtColumn({
    headerClassName: 'min-w-[140px]',
    hiddenOnMobile: true,
  }),
  statusColumn({
    headerClassName: 'min-w-[170px]',
  }),
  details,
  tags,
  ownerEmail,
]

export const pendingClientBGCTableSpecs: TableSpec<Flow>[] = [
  nameColumn({
    headerClassName: 'min-w-[250px]',
    contentClassName: 'flex-1 min-w-[50%]',
  }),
  citizenIdColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  positionColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  contactColumn({ headerClassName: 'min-w-[170px]', hiddenOnMobile: true }),
  createdAtColumn({ headerClassName: 'min-w-[140px]', hiddenOnMobile: true }),
  updatedAtColumn({
    headerClassName: 'min-w-[140px]',
    hiddenOnMobile: true,
  }),
  expiryLabelColumn({
    headerClassName: 'min-w-[140px]',
    contentClassName:
      'min-w-0 flex items-center justify-start sm:table-cell sm:text-center',
  }),
  latestClientProcessColumn(
    {
      headerClassName: 'min-w-[250px]',
      showHeaderInCellOnMobile: true,
    },
    false
  ),
  resendLinkColumn({ headerClassName: 'min-w-[140px] pt-0 sm:pt-4' }),
  tags,
  ownerEmail,
]

export const blockedBGCTableSpecs: TableSpec<Flow>[] = [
  nameColumn({
    headerClassName: 'min-w-[250px]',
    contentClassName: 'w-full sm:w-auto',
  }),
  citizenIdColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  positionColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  contactColumn({
    headerClassName: 'min-w-[170px]',
    hiddenOnMobile: true,
  }),
  {
    key: 'requiredProcesses',
    header: 'flowTable.header.requiredProcesses',
    headerClassName: 'text-center min-w-[100px]',
    contentClassName: 'text-center',
    hiddenOnMobile: true,
    renderValue: (item) => <RequiredProcesses flow={item} />,
  },
  createdAtColumn({
    headerClassName: 'min-w-[140px]',
    hiddenOnMobile: true,
  }),
  updatedAtColumn({
    headerClassName: 'min-w-[140px]',
    contentClassName: 'w-full sm:w-auto flex sm:table-cell',
    showHeaderInCellOnMobile: true,
    hiddenOnMobile: false,
  }),
  failedReasonsColumn({
    headerClassName: 'min-w-[250px]',
    contentClassName: 'flex sm:table-cell',
    showHeaderInCellOnMobile: true,
  }),
  tags,
  ownerEmail,
]

export const pendingOperationBGCTableSpecs: TableSpec<Flow>[] = [
  nameColumn({
    headerClassName: 'min-w-[250px]',
    contentClassName: 'w-full sm:w-auto',
  }),
  citizenIdColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  positionColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  contactColumn({ headerClassName: 'min-w-[170px]', hiddenOnMobile: true }),
  createdAtColumn({ headerClassName: 'min-w-[140px]', hiddenOnMobile: true }),
  updatedAtColumn({
    headerClassName: 'min-w-[140px]',
    hiddenOnMobile: true,
  }),
  {
    key: 'resultProgress',
    header: 'flowTable.header.status',
    headerClassName: 'min-w-[180px]',
    renderValue: (item) => <ResultProgress flow={item} />,
  },
  tags,
  ownerEmail,
]

export const receivedBGCTableSpecs: TableSpec<Flow>[] = [
  nameColumn({
    headerClassName: 'min-w-[250px]',
    contentClassName: 'w-full sm:w-auto',
  }),
  citizenIdColumn({
    headerClassName: 'min-w-[180px]',
    hiddenOnMobile: true,
  }),
  positionColumn({
    headerClassName: 'min-w-[180px]',
    contentClassName: 'flex sm:table-cell w-full sm:w-auto',
    showHeaderInCellOnMobile: true,
  }),
  contactColumn({ headerClassName: 'min-w-[170px]', hiddenOnMobile: true }),
  createdAtColumn({ headerClassName: 'min-w-[140px]', hiddenOnMobile: true }),
  updatedAtColumn({
    headerClassName: 'min-w-[140px]',
    showHeaderInCellOnMobile: true,
    contentClassName: 'w-full sm:w-auto',
  }),
  completedAtColumn({
    headerClassName: 'min-w-[140px]',
    hiddenOnMobile: true,
  }),
  {
    key: 'resultOverview',
    header: 'flowTable.header.resultOverview',
    headerClassName: 'text-center min-w-[150px]',
    contentClassName: 'sm:text-center flex sm:table-cell w-full sm:w-auto',
    showHeaderInCellOnMobile: true,
    renderValue: (item) => <ResultOverview flow={item} />,
  },
  {
    key: 'resultStatus',
    header: 'flowTable.header.resultStatus',
    headerClassName: 'text-center min-w-[190px]',
    contentClassName: 'sm:text-center flex sm:table-cell w-full sm:w-auto',
    showHeaderInCellOnMobile: true,
    renderValue: (item) => <EvaluationResultLabel flow={item} />,
  },
  tags,
  ownerEmail,
]
