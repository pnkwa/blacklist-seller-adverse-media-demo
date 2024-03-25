import { BGCProcessResult } from './processResult'
import { CRSSHOperationStatus } from './status'

enum BGCOperationAppRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  SUPPORT = 'support',
}

interface Remark {
  content: string
  from: BGCOperationAppRole
  createdAt: string
}

export enum InspectionSystem {
  CRIMINAL_RECORDS = 'criminalRecords',
  WARRANT_RECORDS = 'warrantRecords',
  SOCIAL_SECURITY = 'socialSecurity',
}

export interface CRSSHResultItem {
  id: string
  inspectionSystem: InspectionSystem
  foundRecord?: boolean
  detail?: string
  remark?: string
  startDate?: string
  endDate?: string
}

export interface Address {
  residentNo?: string
  moo?: string
  soi?: string
  road?: string
  subDistrict?: string
  district?: string
  province?: string
}

export interface EditableAdditionalInfo {
  fatherTitle?: string
  fatherFirstName?: string
  fatherLastName?: string
  motherTitle?: string
  motherFirstName?: string
  motherLastName?: string
  phoneNumber?: string
  address?: Address
}

export interface AdditionalInfo extends EditableAdditionalInfo {
  edits?: Omit<AdditionalInfo, 'edits'>
}

interface BaseCRSSH extends BGCProcessResult {
  submitted: boolean
  submittedAt?: string
  operationStatus: CRSSHOperationStatus
  results?: CRSSHResultItem[]
  resultDocumentKey?: string
  resultDocumentUrl?: string
  remarks: Remark[]
}

export interface CriminalRecord extends BaseCRSSH {
  consentDocumentKey?: string
  consentDocumentUrl?: string
  poaConsentDocumentKey?: string
  poaConsentDocumentUrl?: string
  idCardPhotocopyDocumentKey?: string
  idCardPhotocopyDocumentUrl?: string
  additionalInfo?: AdditionalInfo
}

export interface SocialSecurityHistory extends BaseCRSSH {
  consentDocumentKey?: string
  consentDocumentUrl?: string
}

export type CRSSH = CriminalRecord | SocialSecurityHistory
