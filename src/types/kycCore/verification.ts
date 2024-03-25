import { Masterdata, Model } from '../generic'
import { NotifyType } from './notifyType'
import { VerificationStatus } from './verificationStatus'
import { FrontIdCardConfig, VerifyConfig } from './verifyConfig'
import {
  Appointment,
  ChipDopaResult,
  DipChipResult,
  DopaResult,
  FaceRecognitionResult,
  FrontIdCardResult,
  IdCardResult,
  LivenessResult,
  PassportResult,
} from './verifyResult'

export enum VerificationProcess {
  FRONT_ID_CARD = 'frontIdCard',
  BACK_ID_CARD = 'backIdCard',
  DOPA = 'dopa',
  PASSPORT = 'passport',
  LIVENESS = 'liveness',
  FACE_RECOGNITION = 'faceRecognition',
  DIP_CHIP = 'dipChip',
  CHIP_DOPA = 'chipDopa',
}

export const kycProcesses = [
  VerificationProcess.FRONT_ID_CARD,
  VerificationProcess.PASSPORT,
  VerificationProcess.BACK_ID_CARD,
  VerificationProcess.DOPA,
  VerificationProcess.LIVENESS,
  VerificationProcess.FACE_RECOGNITION,
]

export interface VerificationInput {
  id?: string | null
  proprietors?: { id: string }[]
  verificationId?: string | null
  frontIdCardConfig?: FrontIdCardConfig
  backIdCardConfig?: VerifyConfig
  passportConfig?: VerifyConfig
  livenessConfig?: VerifyConfig
  dipChipConfig?: VerifyConfig
  dopaConfig?: VerifyConfig
}

/**
 * I splitted Verification into KycVerification and Verification, Verification
 * is the model from case keeper core with additional fields like User and
 * KycStatus.
 */
export interface KYCVerification extends Model {
  /** parent verification id */
  verificationId?: string | null
  /** parent verification */
  verification?: KYCVerification
  /** children verifications */
  verifications?: KYCVerification[] | null
  reusedResults?: KYCProcessName[]
  ref?: string | null
  status: VerificationStatus
  notifyType: NotifyType
  verifiedAt?: string | null
  expiresAt?: string | null
  notifiesAt?: string | null
  frontIdCardConfig: FrontIdCardConfig
  passportConfig: VerifyConfig
  backIdCardConfig: VerifyConfig
  livenessConfig: VerifyConfig
  faceRecognitionConfig: VerifyConfig
  dipChipConfig: VerifyConfig
  dopaConfig: VerifyConfig
  chipDopaConfig: VerifyConfig
  citizenId?: string | null
  title?: Masterdata | null
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  email?: string | null
  phoneNumber?: string | null
  feedback?: string | null
  frontIdCardResult?: FrontIdCardResult | null
  frontIdCardResults?: FrontIdCardResult[] | null
  passportResult?: PassportResult | null
  passportResults?: PassportResult[] | null
  backIdCardResult?: IdCardResult | null
  backIdCardResults?: IdCardResult[] | null
  livenessResult?: LivenessResult | null
  livenessResults?: LivenessResult[] | null
  faceRecognitionResult?: FaceRecognitionResult | null
  faceRecognitionResults?: FaceRecognitionResult[] | null
  dopaResult?: DopaResult | null
  dopaResults?: DopaResult[] | null
  dipChipResult?: DipChipResult | null
  dipChipResults?: DipChipResult[] | null
  chipDopaResult?: ChipDopaResult | null
  chipDopaResults?: ChipDopaResult[] | null
  pdpaConsented?: boolean
  appointment?: Appointment | null
}

export type KYCProcessName =
  | 'frontIdCard'
  | 'passport'
  | 'backIdCard'
  | 'liveness'
  | 'faceRecognition'
  | 'dopa'
  | 'dipChip'

export type DipChipCompareResultKey =
  | 'response'
  | 'idCardResponse'
  | 'faceComparison'

export enum FrontIdCardError {
  FONT_DETECT = 'idCardFont',
  MICRO_PRINT = 'microprint',
  RECAPTURE_DETECTION_ENABLED = 'recapture',
  MUGSHOT_THRESHOLD = 'mugshot',
}
