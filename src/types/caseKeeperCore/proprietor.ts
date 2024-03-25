import { NotifyType } from 'types/kycCore'
import { Masterdata, Model } from '../generic'
import { User } from './user'

export interface Proprietor extends Model {
  caseId?: string
  userId?: string
  user?: User
  citizenId?: string
  countryCode?: string
  passportNumber?: string
  title?: Masterdata
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: string
  inviteType?: NotifyType
  certificationNumber?: string
  memberNumber?: string
  notifyType?: NotifyType
}
