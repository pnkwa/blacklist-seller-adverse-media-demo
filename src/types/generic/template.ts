import { FieldConfig } from './form'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ImportSpreadsheet = Record<FieldConfig['key'], any>

export interface ValidatedImportSpreadsheet {
  valids: ImportSpreadsheet[]
  invalids: ImportSpreadsheet[]
}
