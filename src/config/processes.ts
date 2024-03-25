import KycIcon from 'assets/svg/processes/ekyc.svg?react'
import AdverseMediaIcon from 'assets/svg/processes/adverse-media.svg?react'
import CriminalRecordIcon from 'assets/svg/processes/criminal-record.svg?react'
import SocialSecurityHistoryIcon from 'assets/svg/processes/social-security-history.svg?react'
import Education from 'assets/svg/processes/education.svg?react'
import IncomeIcon from 'assets/svg/processes/income.svg?react'
import SanctionIcon from 'assets/svg/processes/sanction.svg?react'
import EmploymentReferenceIcon from 'assets/svg/processes/employment-reference.svg?react'
import BankruptcyIcon from 'assets/svg/processes/bankruptcy.svg?react'
import { BackgroundCheckProcessName } from 'types/bgcCore'
import { SVGAssetComponent } from 'types/generic'
import { VerificationProcess } from 'types/kycCore'

export enum BatchStatus {
  IN_PROGRESS = 'inProgress',

  // KYC section
  NOT_VERIFIED = 'notVerified',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  APPROVED = 'approved',

  // Bgc section
  NEED_REVIEW = 'needReview',
  CHECKED = 'checked',
}

interface ProcessesConfig {
  key: string
  title: string
  subTitle?: string
  date?: string | Date
  iconStatus?: BatchStatus
  iconClassName?: string
  SVGIcon?: SVGAssetComponent
}

const bgcProcessName = Object.values(BackgroundCheckProcessName)
export const processesName = [
  VerificationProcess.FRONT_ID_CARD,
  VerificationProcess.PASSPORT,
  VerificationProcess.DIP_CHIP,
  ...bgcProcessName,
]

export const processesConfig: ProcessesConfig[] = [
  {
    key: 'kyc',
    title: 'processes.kyc',
    SVGIcon: KycIcon,
  },
  {
    key: BackgroundCheckProcessName.CRIMINAL_RECORD,
    title: 'processes.criminalRecord',
    SVGIcon: CriminalRecordIcon,
  },
  {
    key: BackgroundCheckProcessName.SOCIAL_SECURITY_HISTORY,
    title: 'processes.socialSecurityHistory',
    SVGIcon: SocialSecurityHistoryIcon,
  },
  {
    key: BackgroundCheckProcessName.ADVERSE_MEDIA,
    title: 'processes.adverseMedia',
    SVGIcon: AdverseMediaIcon,
  },
  {
    key: BackgroundCheckProcessName.BANKRUPTCY,
    title: 'processes.bankruptcy',
    SVGIcon: BankruptcyIcon,
  },
  {
    key: BackgroundCheckProcessName.SANCTION,
    title: 'processes.sanction',
    SVGIcon: SanctionIcon,
  },
  {
    key: BackgroundCheckProcessName.EDUCATION,
    title: 'processes.education',
    SVGIcon: Education,
  },
  {
    key: BackgroundCheckProcessName.INCOME,
    title: 'processes.income',
    SVGIcon: IncomeIcon,
  },
  {
    key: BackgroundCheckProcessName.EMPLOYMENT_REFERENCE,
    title: 'processes.employmentReference',
    SVGIcon: EmploymentReferenceIcon,
  },
]

export const clientBGCProcesses = [
  BackgroundCheckProcessName.CRIMINAL_RECORD,
  BackgroundCheckProcessName.SOCIAL_SECURITY_HISTORY,
  BackgroundCheckProcessName.EDUCATION,
  BackgroundCheckProcessName.INCOME,
  BackgroundCheckProcessName.EMPLOYMENT_REFERENCE,
]

export const clientKYCProcesses = [
  VerificationProcess.FRONT_ID_CARD,
  VerificationProcess.PASSPORT,
  VerificationProcess.BACK_ID_CARD,
  VerificationProcess.DOPA,
  VerificationProcess.LIVENESS,
]
