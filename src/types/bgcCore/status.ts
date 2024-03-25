import { VerificationStatus } from 'types/kycCore'

export enum BackgroundCheckStatus {
  UNSPECIFIED = 'unspecified',
  OPEN = 'open',
  BLOCKED = 'blocked',
  PENDING_CLIENT = 'pendingClient',
  PENDING_OPERATION = 'pendingOperation',
  UNVERIFIABLE = 'unverifiable',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum BackgroundApprovalStatus {
  UNSPECIFIED = 'unspecified',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TranscriptOperationStatus {
  OPEN = 'open',
  PENDING_DOCS = 'pendingDocs',
  COMPLETED = 'completed',
}

export enum CRSSHOperationStatus {
  OPEN = 'open',
  /** supervisor sends case back to operation admin */
  REVIEW_FAILED = 'reviewFailed',
  /** support sends case back to operation admin */
  REOPENED = 'reopened',
  /** operation admin sends case to supervisor */
  NEED_REVIEW = 'needReview',
  /** operation admin sends case to support */
  NEED_SUPPORT = 'needSupport',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum EducationOperationStatus {
  OPEN = 'open',
  PENDING = 'pending', // got result + appman cert but waiting for university cert
  COMPLETED = 'completed', // when all transcripts are COMPLETED
}

export enum EducationDocumentStatus {
  UNSPECIFIED = 'unspecified',
  RECEIVED = 'received',
}

export enum IncomeOperationStatus {
  OPEN = 'open',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

const baseBackgroundProcessStatuses = {
  OPEN: BackgroundCheckStatus.OPEN,
  BLOCKED: BackgroundCheckStatus.BLOCKED,
  PENDING_OPERATION: BackgroundCheckStatus.PENDING_OPERATION,
  COMPLETED: BackgroundCheckStatus.COMPLETED,
  VERIFIED: BackgroundCheckStatus.VERIFIED,
  EXPIRED: BackgroundCheckStatus.EXPIRED,
}

export const criminalRecordStatuses = {
  ...baseBackgroundProcessStatuses,
  REJECTED: BackgroundCheckStatus.REJECTED,
  PENDING_CLIENT: BackgroundCheckStatus.PENDING_CLIENT,
}

export const socialSecurityHistoryStatuses = {
  ...baseBackgroundProcessStatuses,
  REJECTED: BackgroundCheckStatus.REJECTED,
  PENDING_CLIENT: BackgroundCheckStatus.PENDING_CLIENT,
}

export const adverseMediaStatuses = {
  ...baseBackgroundProcessStatuses,
}

export const sanctionStatuses = {
  ...baseBackgroundProcessStatuses,
}

export const bankruptcyStatuses = {
  ...baseBackgroundProcessStatuses,
}

export const educationStatuses = {
  ...baseBackgroundProcessStatuses,
  PENDING_CLIENT: BackgroundCheckStatus.PENDING_CLIENT,
  UNVERIFIABLE: BackgroundCheckStatus.UNVERIFIABLE,
}

export const employmentReferenceStatuses = {
  ...baseBackgroundProcessStatuses,
  PENDING_CLIENT: BackgroundCheckStatus.PENDING_CLIENT,
  UNVERIFIABLE: BackgroundCheckStatus.UNVERIFIABLE,
}

export const incomeStatuses = {
  ...baseBackgroundProcessStatuses,
  PENDING_CLIENT: BackgroundCheckStatus.PENDING_CLIENT,
}

export type Statuses =
  | VerificationStatus
  | BackgroundCheckStatus
  | BackgroundApprovalStatus
  | EducationDocumentStatus
  | null
  | undefined
