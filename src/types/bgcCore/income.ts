import { Model } from '../generic'
import { IncomeOperationStatus } from './status'
import { BGCProcessResult } from './processResult'

export interface Document extends Model {
  id: string
  documentKey: string
  documentUrl?: string
  password?: string
}

export interface BankStatement extends Document {
  ocrId?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ocrResult?: any
}

export interface BankStatementResult {
  transactionDate: string
  amount: number
  description: string
}

export interface PayslipResult {
  baseSalary: number
  netSalary: number
}

export interface IncomeResult {
  date: string
  payslip: PayslipResult
  bankStatement: BankStatementResult
  verified?: boolean
}

export interface Income extends BGCProcessResult {
  operationStatus: IncomeOperationStatus
  results?: IncomeResult[]
  bankStatements?: BankStatement[]
  payslips?: Document[]
  remark?: string
}
