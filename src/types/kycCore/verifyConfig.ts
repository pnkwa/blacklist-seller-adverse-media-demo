import { FaceRecognitionProvider } from './faceRecognitionProvider'
import { LivenessProvider } from './livenessProvider'

export interface VerifyConfig {
  attempts?: number
  compareNonEssentialFields?: string[] // For frontIdCard
  currentAttempt?: number
  dependenciesRequired?: boolean
  isEditable?: boolean // For frontIdCard & backIdCard & passport
  livenessCount?: number // For liveness
  livenessProvider?: LivenessProvider
  faceRecognitionProvider?: FaceRecognitionProvider
  minFaceTecMatchLevel?: number // For FaceTec
  required: boolean
  threshold?: number
  /** @deprecated use threshold */
  threshHold?: number
  countryCodeBlacklist?: string[]
  minimumAge?: number
  maximumAge?: number
  expiryThreshold?: string
}

export enum FrontIdCardCompareFields {
  CITIZEN_ID = 'citizenId',
  DATE_OF_BIRTH = 'dateOfBirth',
  TITLE = 'title',
  FIRST_NAME_TH = 'firstNameTh',
  MIDDLE_NAME_TH = 'middleNameTh',
  LAST_NAME_TH = 'lastNameTh',
  FIRST_NAME_EN = 'firstNameEn',
  MIDDLE_NAME_EN = 'middleNameEn',
  LAST_NAME_EN = 'lastNameEn',
  ADDRESS = 'address',
  ISSUE_DATE = 'issueDate',
  EXPIRY_DATE = 'expiryDate',
  MIDDLE_NAME_AND_LAST_NAME_TH = 'middleNameAndLastNameTh',
  MIDDLE_NAME_AND_LAST_NAME_EN = 'middleNameAndLastNameEn',
}

export enum PassportCompareFields {
  PASSPORT_NUMBER = 'passportNumber',
  FIRST_NAME = 'firstName',
  MIDDLE_NAME = 'middleName',
  LAST_NAME = 'lastName',
  GENDER = 'gender',
  ISSUING_STATE = 'issuingState',
  NATIONALITY = 'nationality',
  DATE_OF_BIRTH = 'dateOfBirth',
  EXPIRY_DATE = 'expiryDate',
  LAST_NAME_AND_FIRST_NAME = 'lastNameFirstName',
  LAST_NAME_AND_FIRST_NAME_AND_MIDDLE_NAME = 'lastNameFirstNameMiddleName',
}

export type FrontIdCardConfig = VerifyConfig & {
  compareNonEssentialFields?: boolean
}

export enum BackIdCardCompareFields {
  LASER_CODE = 'laserCode',
}
