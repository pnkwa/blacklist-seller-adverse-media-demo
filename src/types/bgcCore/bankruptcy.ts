import { BGCProcessResult } from './processResult'

export interface Bankruptcy extends BGCProcessResult {
  foundRecord: boolean
  result?: BankruptcyResult
  documentKey?: string
  documentUrl?: string
}

export interface BankruptcyResult {
  caseNo: string
  court: string
  bankruptcyBlackCaseNo: string
  bankruptcyRedCaseNo: string
  byPlaintiff: string
  data: BankruptcyDataFields[][]
}

export interface BankruptcyDataFields {
  translation?: { th: string; en: string }
  value?: string
}
