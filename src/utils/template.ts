import { Client } from 'types/tenantConfig'
import {
  FieldConfig,
  FieldType,
  ImportSpreadsheet,
  ValidatedImportSpreadsheet,
  ValidationType,
} from 'types/generic'
import {
  findByMasterdataValue,
  getTitleData,
  getTitleDataValue,
} from 'masterdata'
import { NotifyType } from 'types/kycCore'
import { FlowInput } from 'types/caseKeeperCore'
import { sampleSpreadSheetData } from 'config/csv'
import { pick, reduceObjValues, replaceQuotesCSVField } from './common'
import { getAllCreateLinkFormFields, getValidations } from './form'

const checkNotifyTypeInput = (
  input: string | undefined,
  data?: { email?: string; phoneNumber?: string }
): SpreadsheetError[] => {
  const notifyType = NotifyType[input?.toUpperCase() as string]
  if (!notifyType) return [{ key: 'notifyType' }]
  if (notifyType === NotifyType.SMS && !data?.phoneNumber)
    return [{ key: 'phoneNumber' }]
  if (notifyType === NotifyType.EMAIL && !data?.email) return [{ key: 'email' }]
  return []
}

const validateFromTemplateFields = [
  'citizenId',
  'firstName',
  'middleName',
  'lastName',
  'dateOfBirth',
  'passportNumber',
  'baseSalary',
  'department',
]

const additionalValidationFields: FieldConfig[] = [
  { key: 'email', validation: [ValidationType.EMAIL] },
  { key: 'phoneNumber', validation: [ValidationType.PHONE_NUMBER] },
]

interface SpreadsheetError {
  key: keyof ImportSpreadsheet
}
type CheckValidSpreasheetResult = boolean | SpreadsheetError[]
export const checkValidSpreadsheetFields = (
  item: ImportSpreadsheet,
  client: Client
): CheckValidSpreasheetResult => {
  const errors: SpreadsheetError[] = []
  const { createLinkForms: forms, positions } =
    client.backgroundCheckDashboardConfig ?? {}

  const position = positions?.[item.position?.key]
  const formKey = position?.formKey
  const form = forms?.[formKey ?? '']

  if (!position || !form) errors.push({ key: 'position' })

  const invalidFields = form?.fields
    ?.filter((field) => validateFromTemplateFields.includes(field.key))
    ?.filter(
      (field) =>
        !field.requiredProcess ||
        position?.backgroundCheck?.processConfigs?.[field.requiredProcess]
    )
    ?.concat(additionalValidationFields)
    ?.filter((field) => {
      const result = Object.values(getValidations(field.validation)).some(
        (validation) => validation(item[field.key]) !== true
      )
      return !field.hidden && result
    })

  if (invalidFields?.length) errors.push(...invalidFields)

  const titles = getTitleData('titles', client)
  const title = titles?.find((t) => t.key === item.title?.key)
  const isTitleRequired = form?.fields
    ?.find((f) => f.key === 'title')
    ?.validation?.includes(ValidationType.REQUIRED)
  if (isTitleRequired && !item.title && !title) errors.push({ key: 'title' })

  if (item.notifyType) item.notifyType = item.notifyType.toLowerCase()
  errors.push(...checkNotifyTypeInput(item.notifyType, item))

  if (errors.length > 0) return errors

  return true
}

const validateSpreadsheetData = (
  flows: ImportSpreadsheet[],
  client: Client
): ValidatedImportSpreadsheet => {
  const { invalids, valids } = flows.reduce(
    (acc, curr) => {
      const validation = checkValidSpreadsheetFields(curr, client)
      if (validation === true) acc.valids.push(curr)
      else if (Array.isArray(validation)) {
        curr.errors = validation
        const clearedCurr = validation.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.key]: '',
          }),
          curr
        )
        const newValidation = checkValidSpreadsheetFields(clearedCurr, client)
        acc.invalids.push({
          ...clearedCurr,
          errors:
            typeof newValidation === 'boolean' ? undefined : newValidation,
        })
      }
      return acc
    },
    { valids: [], invalids: [] }
  )
  return { valids, invalids }
}

const getOption = (value: string, field: FieldConfig, client: Client) => {
  if (field.options)
    return field.options.find((o) => findByMasterdataValue(o, value))
  if (field.optionsSource)
    return getTitleDataValue(field.optionsSource, value, client)
  return undefined
}
const transformSpreadsheetDropdownFields = (
  data: ImportSpreadsheet[],
  client: Client
) => {
  const fields = getAllCreateLinkFormFields(client)
  return data.map((d) =>
    Object.keys(d).reduce((acc, curr) => {
      const field = fields.find((f) => f.key === curr)
      acc[curr] =
        field?.type === FieldType.DROPDOWN
          ? getOption(d[curr], field, client)
          : d[curr]
      return acc
    }, {} as ImportSpreadsheet)
  )
}

export const parseXLSXToFlowInput = (
  data: ImportSpreadsheet[],
  client: Client
): ValidatedImportSpreadsheet =>
  validateSpreadsheetData(
    transformSpreadsheetDropdownFields(
      data.map((obj) => reduceObjValues(obj, replaceQuotesCSVField)),
      client
    ),
    client
  )

export interface CSVResults {
  data: ImportSpreadsheet[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[]
  meta: {
    aborted: boolean
    cursor: number
    delimiter: string
    linebreak: string
    truncated: boolean
    fields: string[]
  }
}
export const parseCSVToFlowInput = (results: CSVResults, client: Client) => {
  const { data, meta, errors } = results
  const fields = getAllCreateLinkFormFields(client)
  const templateKeys = fields.map((f) => f.key)

  // Handle if the upload is aborted somehow that the lib has detected
  if (meta.aborted || errors.length > 0)
    throw new Error('importFile.csv.invalidFormat')
  // Handle no data
  if (data.length === 0) throw new Error('importFile.csv.invalidFormat')

  // Handle some field doesn't exist in the current template
  if (!meta.fields || meta.fields?.some((curr) => !templateKeys.includes(curr)))
    throw new Error('importFile.csv.invalidFormat')
  return validateSpreadsheetData(
    transformSpreadsheetDropdownFields(data, client),
    client
  )
}

export const getSpreadsheetSampleDataByClient = (client: Client) => {
  const createLinkFormFields = getAllCreateLinkFormFields(client)
  if (!createLinkFormFields.length) return []

  const createLinkFormKeys = createLinkFormFields.map((f) => f.key)

  return [pick(sampleSpreadSheetData, createLinkFormKeys)]
}

export const convertImportSpreadsheetToFlowInput = (
  data: ImportSpreadsheet,
  client: Client
): FlowInput => {
  const { position: positionKey } = data
  const position =
    client.backgroundCheckDashboardConfig?.positions?.[positionKey?.key]
  if (data.notifyType) data.notifyType = data.notifyType.toLowerCase()
  return {
    ...position,
    position: undefined,
    formKey: undefined,
    proprietor: data,
    backgroundCheck: {
      ...position?.backgroundCheck,
      verificationInfo: {
        position: data.position,
        department: data.department
          ? {
              translations: {
                en: data.department,
                th: data.department,
              },
            }
          : undefined,
        baseSalary: Number(data.baseSalary) || undefined,
      },
    },
    verification: {
      ...position?.verification,
      notifyType: data.notifyType,
      phoneNumber: data.phoneNumber,
      email: data.email,
    },
  } as FlowInput
}
