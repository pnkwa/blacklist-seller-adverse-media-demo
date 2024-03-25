export enum VerificationStatus {
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  IN_PROGRESS = 'in_progress',
  INCOMPLETE = 'incomplete',
  OPEN = 'open',
  VERIFICATION_STATUS_UNSPECIFIED = 'unspecified',
  VERIFIED = 'verified',
}

/**
 * Sorted in order to display in dropdown.
 * Values are a sub-set of VerificationStatus.
 */
export const KYCStatus = {
  OPEN: VerificationStatus.OPEN,
  IN_PROGRESS: VerificationStatus.IN_PROGRESS,
  VERIFIED: VerificationStatus.VERIFIED,
  COMPLETED: VerificationStatus.COMPLETED,
  EXPIRED: VerificationStatus.EXPIRED,
}

/**
 * Sorted in order to display in dropdown.
 * Values are a sub-set of VerificationStatus.
 */
export const DipChipStatus = {
  OPEN: VerificationStatus.OPEN,
  IN_PROGRESS: VerificationStatus.IN_PROGRESS,
  VERIFIED: VerificationStatus.VERIFIED,
  COMPLETED: VerificationStatus.COMPLETED,
  BLOCKED: VerificationStatus.BLOCKED,
  INCOMPLETE: VerificationStatus.INCOMPLETE,
  EXPIRED: VerificationStatus.EXPIRED,
  CANCELLED: VerificationStatus.CANCELLED,
}

export enum ResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
}
