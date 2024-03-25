import { Model } from '../generic'
import { BGCProcessResult } from './processResult'
import { EducationOperationStatus, TranscriptOperationStatus } from './status'

export enum TranscriptCheckMethod {
  UNSPECIFIED = 'unspecified',
  DIGITAL = 'digital', // check with EDGA
  INSTITUTE = 'institute',
  UNVERIFIABLE = 'unverifiable',
}

export enum TranscriptCheckResult {
  UNSPECIFIED = 'unspecified',
  VERIFIED = 'verified',
  NOT_VERIFIED = 'notVerified',
}

export interface EducationInstitute {
  code: string
  translations: Record<string, string>
  consentLogo?: string
}

export interface EducationLevel {
  code: string
  translations: Record<string, string>
}

export interface EducationConsentDocument {
  instituteCode: string // code from institutes masterdata
  documentKey: string // s3 key
  documentUrl?: string // s3 url
}

export interface AdditionalDocument {
  id: string
  fileName?: string
  documentKey?: string
  documentUrl?: string
  fileSize?: number
  createdAt?: string
  mimeType?: string
  type?: string
}
export interface Transcript extends Model {
  /** s3 path to the transcript document (either image or pdf) */
  documentKey: string
  documentUrl?: string
  operationStatus: TranscriptOperationStatus
  institute: EducationInstitute
  educationLevel: EducationLevel
  method: TranscriptCheckMethod
  result: TranscriptCheckResult
  remark?: string | null
  providerCertificateKey?: string | null
  providerCertificateUrl?: string | null
  providerCertificateFile?: File
  instituteCertificateKey?: string | null
  instituteCertificateUrl?: string | null
  instituteCertificateFile?: File
}

export interface Education extends BGCProcessResult {
  signed: boolean
  signatureImageKey: string | null
  signatureImageUrl: string | null
  operationStatus: EducationOperationStatus
  transcripts?: Transcript[]
  poaDocumentKey: string | null
  poaDocumentUrl: string | null
  consentDocuments?: EducationConsentDocument[] | null
  idCardPhotocopyDocumentKey: string | null
  idCardPhotocopyDocumentUrl: string | null
  additionalDocuments?: AdditionalDocument[]
}
