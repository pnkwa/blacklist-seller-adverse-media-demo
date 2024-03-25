import { KYCVerification, VerificationStatus } from 'types/kycCore'
import { User } from './user'

export interface Verification extends KYCVerification {
  userId?: string
  user?: User
  kycStatus?: VerificationStatus
  kycVerifiedAt?: Date | null
  dipChipStatus?: VerificationStatus
  dipChipVerifiedAt?: Date | null
  passportNumber?: string | null
  faceImageUrl?: string | null
}
