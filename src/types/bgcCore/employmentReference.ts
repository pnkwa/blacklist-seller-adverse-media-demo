import { Model } from '../generic'
import { BGCProcessResult } from './processResult'

export interface ReferencePerson extends Model {
  firstName: string
  lastName: string
  position: string
  companyName: string
  companyPosition: string
  phoneNumber: string
}

export interface EmploymentDocument extends Model {
  documentKey: string
  documentUrl: string
}

export enum EmploymentReferenceResult {
  UNSPECIFIED = 'unspecified',
  PASSED = 'passed',
  FAILED = 'failed',
  UNVERIFIABLE = 'unverifiable',
}

export interface EmploymentReference extends BGCProcessResult {
  remark?: string
  references?: ReferencePerson[]
  employmentDocuments?: EmploymentDocument[]
  result: EmploymentReferenceResult
  providerCertificateKey?: string
  providerCertificateUrl?: string
}
