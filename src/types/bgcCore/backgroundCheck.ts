import { Masterdata, Model } from '../generic'
import { AdverseMedia } from './adverseMedia'
import { Bankruptcy } from './bankruptcy'
import { CriminalRecord, SocialSecurityHistory } from './crSSH'
import { ProcessCriteria } from './criteria'
import { Education } from './education'
import { EmploymentReference } from './employmentReference'
import { Income } from './income'
import { BackgroundCheckProcessName } from './processName'
import { Sanction } from './sanction'
import {
  BackgroundApprovalStatus,
  BackgroundCheckStatus,
  EducationDocumentStatus,
} from './status'
import { BGCVerificationInfo } from './verificationInfo'

interface ProcessConfigOptions {
  maxTranscripts?: number
  maxEmploymentDocuments?: number
  maxBankStatements?: number
  maxPayslips?: number
  validatePayslipCount?: number
  criteria?: ProcessCriteria
}

export type ProcessConfigs = Record<
  BackgroundCheckProcessName,
  boolean | ProcessConfigOptions
>

export interface ApprovalRemark {
  from?: string // User that manual approved kyc Verification
  reasons?: Masterdata[]
}

export interface BackgroundCheckInput {
  processConfigs: ProcessConfigs
  expiryDuration?: string
}

export interface BackgroundCheck extends Model {
  expiresAt?: string
  completedAt?: string
  verificationInfo: BGCVerificationInfo
  status: BackgroundCheckStatus
  approvalStatus: BackgroundApprovalStatus
  approvalRemark?: ApprovalRemark
  approvedAt?: string
  processConfigs?: ProcessConfigs
  preferredResultLanguage?: string

  // process results
  criminalRecord?: CriminalRecord
  socialSecurityHistory?: SocialSecurityHistory
  adverseMedia?: AdverseMedia
  bankruptcy?: Bankruptcy
  sanction?: Sanction
  education?: Education
  employmentReference?: EmploymentReference
  income?: Income

  // process result statuses
  criminalRecordStatus: BackgroundCheckStatus
  socialSecurityHistoryStatus: BackgroundCheckStatus
  adverseMediaStatus: BackgroundCheckStatus
  bankruptcyStatus: BackgroundCheckStatus
  sanctionStatus: BackgroundCheckStatus
  educationStatus: BackgroundCheckStatus
  educationDocumentStatus: EducationDocumentStatus
  employmentReferenceStatus: BackgroundCheckStatus
  incomeStatus: BackgroundCheckStatus

  // process result completedAt timestamps
  criminalRecordCompletedAt?: string
  socialSecurityHistoryCompletedAt?: string
  adverseMediaCompletedAt?: string
  bankruptcyCompletedAt?: string
  sanctionCompletedAt?: string
  educationCompletedAt?: string
  employmentReferenceCompletedAt?: string
  incomeCompletedAt?: string
}
