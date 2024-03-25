import { Model } from 'types/generic'
import { BackgroundCheck } from 'types/bgcCore'
import { TabItemConfig } from 'types/generic/tabs'
import { TableSpec } from 'types/generic/table'
import { Proprietor } from './proprietor'
import { User } from './user'
import { Verification } from './verification'

export interface Flow extends Model {
  proprietorId: string
  proprietor?: Proprietor

  verificationId?: string
  verification?: Verification
  tags?: string[]

  userId?: string
  user?: User

  backgroundCheckId?: string
  backgroundCheck?: BackgroundCheck
}

/** the result keys to be stored in redux state */
export enum FlowsResultKey {
  /** cases from previous filter period */
  PREVIOUS_PERIOD = 'previousPeriod',
  /** all statuses in filtered create date */
  ALL = 'all',
  /** kyc not pass + not approved/rejected yet */
  BLOCKED = 'blocked',
  /** `open` and `pendingClient` status */
  PENDING_CLIENT = 'pendingClient',
  PENDING_OPERATION = 'pendingOperation',
  /** `completed` and `verified` status */
  RECEIVED = 'received',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
}

export interface FlowTableTabItemConfig extends TabItemConfig {
  key: FlowsResultKey
  tableSpecs: TableSpec<Flow>[]
  color?: string
  icon?: React.ReactNode
}
