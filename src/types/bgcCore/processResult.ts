import { Model } from '../generic'
import { FailedReason } from './failedReason'

export interface BGCProcessResult extends Model {
  completed: boolean
  verified: boolean
  clientSubmitted: boolean
  clientSubmittedAt: string
  failedReasons: FailedReason[]
}
