import { Flow } from 'types/caseKeeperCore'
import { TableSpec } from 'types/generic/table'
import {
  createdAtColumn,
  nameColumn,
  contactColumn,
  positionColumn,
  expiryLabelColumn,
  latestClientProcessColumn,
  resendLinkColumn,
  failedReasonsColumn,
} from './commonColumns'

export const kycNotPassedOverviewTableSpecs: TableSpec<Flow>[] = [
  createdAtColumn(),
  nameColumn({ contentClassName: 'col-span-full' }),
  contactColumn(),
  positionColumn({ contentClassName: 'text-right' }),
  failedReasonsColumn({
    contentClassName: 'col-span-full sm:text-right sm:max-w-[250px]',
  }),
]

export const pendingClientOverviewTableSpecs: TableSpec<Flow>[] = [
  createdAtColumn(),
  nameColumn({ contentClassName: 'col-span-full' }),
  contactColumn(),
  positionColumn({ contentClassName: 'text-right' }),
  latestClientProcessColumn(),
  expiryLabelColumn({
    contentClassName:
      'flex items-center justify-start sm:table-cell sm:text-center',
  }),
  resendLinkColumn({ contentClassName: 'h-[4rem]' }),
]
