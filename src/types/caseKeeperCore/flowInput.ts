import { LegacyMasterdata, Masterdata } from 'types/generic'
import { ProcessConfigs } from 'types/bgcCore'
import { NotifyType, VerificationInput } from 'types/kycCore'

export interface FlowInput {
  verification?: VerificationInput
  backgroundCheck?: {
    processConfigs?: ProcessConfigs
    verificationInfo?: {
      baseSalary?: number
      position?: Masterdata | LegacyMasterdata
      department?: Masterdata | LegacyMasterdata
    }
  }

  proprietor?: {
    id?: string
    citizenId?: string
    passportNumber?: string
    title?: Masterdata
    firstName?: string
    middleName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    dateOfBirth?: string
    notifyType?: NotifyType
  }

  expiryDuration?: string
  position?: Masterdata
  formKey?: string
  flowName?: string
  packageCode?: string
}

export interface Applicant {
  position?: Masterdata
  citizenId?: string
  title?: Masterdata
  firstName?: string
  middleName?: string
  lastName?: string
  notifyType?: NotifyType
  phoneNumber?: string
  email?: string
  department?: string
  dateOfBirth: string
  baseSalary?: string
}

export interface CreateFlowFormValue {
  applicants: Applicant[]
}
