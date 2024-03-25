/* eslint-disable @typescript-eslint/no-explicit-any */

export enum PassportErrorCode {
  ABOUT_TO_EXPIRE = 'aboutToExpire',
  ACTIVE_AUTH_FAILED = 'activeAuthFailed',
  CHIP_AUTH_FAILED = 'chipAuthFailed',
  COMPARISON = 'comparison',
  EXPIRED = 'expired',
  NFC_NOT_SUPPORTED = 'nfcNotSupported',
  PASSIVE_AUTH_FAILED = 'passiveAuthFailed',
  RESTRICTED_AGE = 'restrictedAge',
  RESTRICTED_COUNTRY = 'restrictedCountry',
  RESTRICTED_NATIONALITY = 'restrictedNationality',
}
export enum FrontIdCardErrorCode {
  ABOUT_TO_EXPIRE = 'aboutToExpire',
  COMPARISON = 'comparison',
  EXPIRED = 'expired',
  FONT = 'font',
  HOLOGRAM = 'hologram',
  MICROPRINT = 'microprint',
  MUGSHOT = 'mugshot',
  RECAPTURE = 'recapture',
  RED_LINE = 'redLine',
  RESTRICTED_AGE = 'restrictedAge',
  LIGHT = 'light',
}
export enum BackIdCardErrorCode {
  COMPARISON = 'comparison',
}
export enum LivenessErrorCode {
  DETECTED_FACE_ATTRIBUTES = 'detectedFaceAttributes',
  FACETEC_FAILED = 'facetecFailed',
  FACE_NOT_FOUND = 'faceNotFound',
  LIVENESS_COUNT_NOT_MET = 'livenessCountNotMet',
  LIVENESS_NOT_DETECTED = 'livenessNotDetected',
  VIDEO_SPOOFING_DETECTED = 'videoSpoofingDetected',
}
export enum FaceRecognitionErrorCode {
  COMPARISON = 'comparison',
}
export enum DipChipErrorCode {
  CARD_OWNER_COMPARE = 'cardOwnerCompare',
  MUGSHOT_COMPARE = 'mugshotCompare',
  FACE_VS_MUGSHOT_COMPARE = 'faceVSMugshotCompare',
  CANNOT_READ_CARD = 'cannotReadCard',
  NOT_IN_SERVICE_AREA = 'notInServiceArea',
}

export type ProcessErrorKey =
  | PassportErrorCode
  | FrontIdCardErrorCode
  | BackIdCardErrorCode
  | LivenessErrorCode
  | FaceRecognitionErrorCode
  | DipChipErrorCode

export interface ProcessErrorItem {
  key: ProcessErrorKey
  skipped?: boolean
}

export interface VerifyResult {
  id: string
  createdAt: string
  updatedAt: string
  response: any
  errors?: ProcessErrorItem[]
  completed?: boolean
  valid?: boolean
  verified: boolean
  failedReasons: string[]
}

export interface ImageFrameInfo {
  fileKey: string
  fileUrl: string
}

export interface IdCardResult extends VerifyResult {
  edits: any
}

export interface FrontIdCardResult extends IdCardResult {
  faceImageUrl?: string
  idCardImageUrl?: string
  idCardImageFrames?: ImageFrameInfo[]
}

export interface PassportResult extends IdCardResult {
  nfcData?: any
  faceImageUrl?: string
  idCardImageUrl?: string
  ocrNationality?: string
  editNationality?: string
}

export interface DopaResult extends VerifyResult {
  dopaRequestFailed: boolean
  responseStatus?: string | null
  isBypassed: boolean
  frontIdCardResultId?: string
  backIdCardResultId?: string
}

export interface ChipDopaResult extends VerifyResult {
  requestFailed: boolean
  responseStatus?: number
  dipChipResultId?: string
}

interface SimilarityMatch {
  similarity: number
  livenessFrameKey?: string
  livenessFrameUrl?: string
}

export enum FaceAttributes {
  HAT = 'hat',
  MASK = 'mask',
  GLASSES = 'glasses',
  MORE_THAN_ONE_PERSON = 'moreThanOnePerson',
  FACE_OCCLUDED = 'faceOccluded',
}

export interface LivenessResult extends VerifyResult {
  livenessImageKey?: string | null
  livenessImageUrl?: string | null
  livenessVideoKey?: string | null
  livenessVideoUrl?: string | null
  livenessFrameMatches?: SimilarityMatch[] | null
  faceAttributesResponse?: any
  faceAttributes?: FaceAttributes[]
}

export interface FaceRecognitionResult extends VerifyResult {
  frontIdCardResultId?: string | null
  passportResultId?: string | null
  livenessResultId?: string | null
  sourceImageUrl?: string | null
  sourceImageKey?: string | null
  targetImageUrl?: string | null
  targetImageKey?: string | null
  isBypassed?: boolean
}

export interface Insight {
  startedAt: Date | null
  endedAt: Date | null
  region?: string | null
  ip?: string | null
  lat?: number | null
  long?: number | null
  zip?: string
  countryCode?: string
  country?: string
  city?: string
  timezone?: string
  approximated: boolean
}

export interface DipChipResult extends VerifyResult {
  identityImageKey: string | null
  idCardImageKey: string | null
  remark: string | null
  response: any
  verified: boolean
  idCardResponse?: any
  faceComparison?: any
  identityImageUrl?: string | null
  idCardImageUrl?: string | null
  citizenId?: string | null
  firstNameEn?: string | null
  lastNameEn?: string | null
  firstNameTh?: string | null
  lastNameTh?: string | null
  title?: string | null
  dateOfBirth?: string | null
  dateOfIssue?: string | null
  dateOfExpiry?: string | null
  address?: string | null
  insight?: Insight | null
}
export interface Appointment {
  startedAt: Date | null
  endedAt: Date | null
  province: string | null
  district: string | null
  subDistrict: string | null
  zipCode: string | null
  address: string | null
  pinCode: number | null
  latitude: number | null
  longtitude: number | null
  validated: boolean
  remark: any
  cancelledReason: string | null
  status?: AppointmentStatus
  dateRange: [Date, Date]
  addressRemark: string | null
  updatedAt?: Date | null
}

export enum AppointmentStatus {
  IN_PROGRESS = 'inProgress',
  DEVICE_MALFUNCTION = 'deviceMalfunction',
  CANNOT_READ_CARD = 'cannotReadCard',
  CUSTOMER_NOT_FOUND = 'customerNotFound',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}
