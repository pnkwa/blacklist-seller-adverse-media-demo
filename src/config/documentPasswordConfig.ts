import { BackgroundCheck, Document } from 'types/bgcCore'

export interface DocumentPasswordConfig {
  fileName: string
  getDocuments: (backgroundCheck: BackgroundCheck) => Document[] | undefined
}
export const incomeDocumentPasswordConfigs: DocumentPasswordConfig[] = [
  {
    fileName: 'Bank_statement',
    getDocuments: (backgroundCheck: BackgroundCheck) =>
      backgroundCheck?.income?.bankStatements,
  },
  {
    fileName: 'Payslip',
    getDocuments: (backgroundCheck: BackgroundCheck) =>
      backgroundCheck?.income?.payslips,
  },
]
