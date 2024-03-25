/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form'
import { GroupBase, OptionsOrGroups } from 'react-select'

export interface SelectOption {
  value?: string
  label: string
}

export enum JuvenileAge {
  SEVENTEEN = 17,
  NORMAL = 19,
  MINUS_7 = 7,
}

export enum ValidationType {
  citizenId = 'citizenID',
  REQUIRED = 'required',
  PHONE_NUMBER = 'phoneNumber',
  PASSPORT_NUMBER = 'passportNumber',
  ENGLISH_ALPHABET = 'englishAlphabet',
  THAI_ALPHABET = 'thaiAlphabet',
  EMAIL = 'email',
  EMAIL_ALREADY_EXISTS = 'emailAlreadyExists',
  MIN_ZERO = 'minimumZero',
  DOB_NORMAL = 'dobNormal',
  DOB_JUVENILE = 'dobJuvenile',
  DOB_JUVENILE_MINUS_7 = 'dobJuvenileMinus7',
  DOB_CC = 'dobCC',
  CONFIRM_PASSWORD = 'confirmPassword',
  PDF_PASSWORD = 'pdfPassword',
  /** @deprecated should check from keycloak's password policy */
  DEPRECATED_USER_PASSWORD = 'deprecatedUserPassword',
}

export enum FieldType {
  CHECK_BOX = 'checkbox',
  CURRENCY = 'currency',
  DATE = 'date',
  DROPDOWN = 'dropdown',
  GUARDIAN = 'guardian',
  INSURED_META = 'insuredMeta',
  NOTIFICATION = 'notification',
  NUMBER = 'number',
  OBJECT = 'object',
  PASSWORD = 'password',
  POLICIES = 'policies',
  PROPRIETOR = 'proprietor',
  RADIO = 'radio',
  RAW = 'raw',
  TEXT = 'text',
  TITLE = 'title',
}

export interface FieldConfig {
  array?: boolean
  autoComplete?: string
  autoEkyc?: boolean
  autoFocus?: boolean
  col?: string
  display?: string
  fields?: FieldConfig[]
  hidden?: boolean
  key: string
  label?: string
  multiple?: boolean
  options?: string[] | OptionsOrGroups<any, GroupBase<any>>
  optionsSource?: string
  pagination?: boolean
  placeholder?: string
  requiredProcess?: string
  templates?: FieldConfig[][]
  tip?: string
  title?: string
  transferFields?: FieldConfig[]
  translatePrefix?: string
  type?: FieldType
  validation?: ValidationType[]
  value?: string
  hideLabel?: boolean
  displayKey?: string
}

export interface UseRenderFormArgs {
  formObject: UseFormReturn<any, any>
  isDisabled?: boolean
  getLabel?: (field: FieldConfig) => string | undefined
  getPlaceholder?: (field: FieldConfig) => string | undefined
}

export interface RendererOptions {
  parentFieldKey?: string
}

export type RendererFunc = (
  fields: FieldConfig[] | undefined,
  parentFieldKey?: string
) => React.ReactNode | null
