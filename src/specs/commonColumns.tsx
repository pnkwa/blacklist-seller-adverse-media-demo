import moment from 'moment'
import classNames from 'classnames'
import { t } from 'i18next'
import { CandidateNameAndPhoto } from 'components/composite/FlowTable/CandidateNameAndPhoto'
import { ExpiryLabel } from 'components/composite/FlowTable/ExpiryLabel'
import { Flow } from 'types/caseKeeperCore'
import { TableSpec } from 'types/generic/table'
import { getContact } from 'utils/flow'
import {
  getPosition,
  getVerificationInfoFullName,
} from 'utils/verificationInfo'
import { DateDisplay } from 'components/composite/FlowTable/DateDisplay'
import { LatestClientProcess } from 'components/composite/FlowTable/LatestClientProcess'
import { ResendLinkButton } from 'components/composite/FlowTable/ResendLinkButton'
import { StatusLabel } from 'components/composite/FlowTable/StatusLabel'
import { KYCFailedReasons } from 'components/composite/FlowTable/KYCFailedReasons'
import { maskCitizenId } from 'utils/string'
import { getDisplayedBackgroundCheckStatus } from 'utils/backgroundCheck'
import { dateFormat } from 'utils/date'
import { dateFormats } from 'config/dateFormats'

const createColumn =
  (spec: TableSpec<Flow>) =>
  (overrideSpecs?: Partial<TableSpec<Flow>>): TableSpec<Flow> => ({
    ...spec,
    ...overrideSpecs,
    headerClassName: classNames(
      spec.headerClassName,
      overrideSpecs?.headerClassName
    ),
    contentClassName: classNames(
      spec.contentClassName,
      overrideSpecs?.contentClassName
    ),
  })

export const createdAtColumn = createColumn({
  key: 'createdAt',
  sortKey: 'createdAt',
  header: 'flowTable.header.createdAt',
  headerClassName: 'text-center sm:w-[120px]',
  contentClassName:
    'sm:text-center w-[120px] col-span-full font-medium sm:font-normal',
  getRawValue: (item: Flow) =>
    dateFormat(item.backgroundCheck?.createdAt, dateFormats.displayDate),
  renderValue: (item) => <DateDisplay value={item.createdAt} />,
})

export const updatedAtColumn = createColumn({
  key: 'updatedAt',
  sortKey: 'updatedAt',
  header: 'flowTable.header.updatedAt',
  headerClassName: 'text-center w-[120px]',
  contentClassName: 'sm:text-center sm:w-[120px] col-span-full sm:font-normal',
  getRawValue: (item: Flow) =>
    moment(item.updatedAt).fromNow() ??
    dateFormat(item.updatedAt, dateFormats.displayDate) ??
    '-',
  renderValue: (item) => (
    <DateDisplay
      value={item.updatedAt}
      formatValue={(value) => moment(value).fromNow()}
    />
  ),
})

export const expiresAtColumn = createColumn({
  key: 'expiresAt',
  sortKey: 'backgroundCheck-expiresAt',
  header: 'flowTable.header.expiresAt',
  headerClassName: 'text-center w-[120px]',
  contentClassName: 'text-center w-[120px] col-span-full font-normal',
  getRawValue: (item: Flow) =>
    dateFormat(item.backgroundCheck?.expiresAt, dateFormats.displayDate),

  renderValue: (item) => (
    <DateDisplay value={item.backgroundCheck?.expiresAt} />
  ),
})

export const expiryLabelColumn = createColumn({
  key: 'expiresAt',
  sortKey: 'backgroundCheck-expiresAt',
  header: 'flowTable.header.expiresAt',
  headerClassName: 'text-center',
  renderValue: (item) => <ExpiryLabel flow={item} />,
})

export const completedAtColumn = createColumn({
  key: 'completedAt',
  sortKey: 'backgroundCheck-completedAt',
  header: 'flowTable.header.completedAt',
  headerClassName: 'text-center w-[120px]',
  contentClassName: 'text-center w-[120px] col-span-full font-normal',
  getRawValue: (item: Flow) =>
    dateFormat(item.backgroundCheck?.completedAt, dateFormats.displayDate),

  renderValue: (item) => (
    <DateDisplay value={item.backgroundCheck?.completedAt} />
  ),
})

export const nameColumn = createColumn({
  key: 'name',
  header: 'flowTable.header.name',
  getRawValue: (item: Flow) =>
    item.backgroundCheck?.verificationInfo
      ? getVerificationInfoFullName(item.backgroundCheck.verificationInfo)
      : '-',
  renderValue: (item) => <CandidateNameAndPhoto flow={item} />,
})

export const citizenIdColumn = createColumn({
  key: 'citizenId',
  header: 'flowTable.header.citizenId',
  headerClassName: 'text-center',
  contentClassName: 'text-center',
  getRawValue: (item: Flow) =>
    item.backgroundCheck?.verificationInfo.citizenId ?? '-',
  renderValue: (item) =>
    maskCitizenId(item.backgroundCheck?.verificationInfo.citizenId),
})

export const contactColumn = createColumn({
  key: 'contact',
  header: 'flowTable.header.contact',
  headerClassName: 'text-center',
  contentClassName: 'mt-[2px] sm:mt-0 text-left sm:text-center',
  renderValue: (item) => getContact(item, true) ?? '-',
})

export const positionColumn = createColumn({
  key: 'position',
  header: 'flowTable.header.position',
  headerClassName: 'text-center',
  contentClassName: 'mt-[2px] sm:mt-0 sm:text-center',
  getRawValue: (item: Flow) =>
    (item.backgroundCheck?.verificationInfo &&
      getPosition(item.backgroundCheck?.verificationInfo)) ??
    '-',
  renderValue: (item) =>
    (item.backgroundCheck?.verificationInfo &&
      getPosition(item.backgroundCheck?.verificationInfo)) ??
    '-',
})

export const latestClientProcessColumn = (
  specs?: Partial<TableSpec<Flow>>,
  withHeader = true
) =>
  createColumn({
    key: 'latestClientProcess',
    header: 'latestClientProcess.title',
    contentClassName: 'col-span-full',
    renderValue: (item) => (
      <LatestClientProcess flow={item} withHeader={withHeader} />
    ),
  })(specs)

export const resendLinkColumn = createColumn({
  key: 'resendLink',
  header: 'resendLink.button',
  headerClassName: 'text-center',
  contentClassName: 'flex items-center justify-end sm:text-center',
  renderValue: (item) => <ResendLinkButton flow={item} />,
})

export const statusColumn = createColumn({
  key: 'status',
  sortKey:
    'backgroundCheck-approvalStatus,backgroundCheck-status,backgroundCheck-expiresAt',
  header: 'flowTable.header.status',
  headerClassName: 'text-center',
  contentClassName: 'text-center',
  getRawValue: (item: Flow) => {
    const status = getDisplayedBackgroundCheckStatus(item.backgroundCheck)
    return status ? t(`flowTable.status.${status}`) : '-'
  },
  renderValue: (item) => <StatusLabel flow={item} />,
})

export const failedReasonsColumn = createColumn({
  key: 'failedReasons',
  header: 'flowTable.header.failedReasons',
  renderValue: (item) => <KYCFailedReasons flow={item} maxDisplayItems={1} />,
})
