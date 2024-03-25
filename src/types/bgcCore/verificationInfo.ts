import { LegacyMasterdata, Masterdata, Model } from 'types/generic'

export interface BGCEditableVerificationInfo {
  citizenId?: string
  phoneNumber?: string

  passportNumber?: string

  titleTH?: string
  firstNameTH?: string
  middleNameTH?: string
  lastNameTH?: string

  titleEN?: string
  firstNameEN?: string
  middleNameEN?: string
  lastNameEN?: string

  dateOfBirth?: string
  dateOfCardExpiry?: string
}

export interface BGCVerificationInfo
  extends Model,
    BGCEditableVerificationInfo {
  ref?: string
  kycVerified: boolean
  kycCompletedAt?: string | Date

  address?: string
  baseSalary?: number
  position?: Masterdata | LegacyMasterdata
  department?: Masterdata | LegacyMasterdata

  frontIdCardImageUrl?: string
  idCardFaceImageUrl?: string
  livenessImageUrl?: string

  edits?: BGCEditableVerificationInfo
}
