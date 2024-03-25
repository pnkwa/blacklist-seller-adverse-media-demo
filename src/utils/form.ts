import { FieldValues, UseFormWatch } from 'react-hook-form'
import i18n from 'i18next'
import { Options } from 'react-select'
import {
  FieldConfig,
  FieldType,
  JuvenileAge,
  ValidationType,
} from 'types/generic'
import { getMasterData } from 'masterdata'
import {
  Client,
  CreateLinkFormConfig,
  PositionConfig,
} from 'types/tenantConfig'
import { getAge, isEmpty } from './common'
import {
  MOBILE_PHONE_VALIDATION,
  THAI_ALPHABET,
  EMAIL,
  NUMBER_ONLY,
  PASSPORT_NUMBER,
  ENGLISH_ALPHABET,
  LINK_HTTPS,
} from './regex'
import { getMasterdataTranslation } from './translations'

export const validateCitizenId = (id?: string) => {
  if (!id || id.length !== 13) return false

  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i), 10) * (13 - i)
  }
  const mod = sum % 11
  const check = (11 - mod) % 10
  return check === parseInt(id.charAt(12), 10)
}

export const validateLink = (link) => link && !LINK_HTTPS.test(link)

interface ValidationRule {
  rule: (value: string | undefined) => boolean | undefined
  message: string
  tOptions?: Record<string, unknown>
}

const validateRules =
  (rules: ValidationRule[]) => (value: string | undefined) =>
    rules
      .map(({ rule, message, tOptions }) =>
        rule(value) ? '' : i18n.t(message, tOptions ?? {})
      )
      .filter((item) => item)
      .join('\n') || true

type FieldValidations = Record<
  ValidationType,
  (value: string | undefined) => boolean | string
>

export const getAllFieldValidations = (
  watch?: UseFormWatch<FieldValues>
): FieldValidations => ({
  citizenID: (value) =>
    validateCitizenId(value?.replace(/-/g, '')) ||
    i18n.t('validation.citizenID'),
  passportNumber: (value = '') =>
    PASSPORT_NUMBER.test(value) || i18n.t('validation.passportNumber'),
  required: (value) =>
    (typeof value === 'string' ? value?.trim() : value)
      ? true
      : i18n.t('validation.required'),
  phoneNumber: (value) =>
    !value || MOBILE_PHONE_VALIDATION.test(value) || i18n.t('validation.phone'),
  englishAlphabet: (value) =>
    !value || ENGLISH_ALPHABET.test(value) || i18n.t('validation.englishName'),
  thaiAlphabet: (value) =>
    !value || THAI_ALPHABET.test(value) || i18n.t('validation.thaiName'),
  email: (value) => !value || EMAIL.test(value) || i18n.t('validation.email'),
  emailAlreadyExists: () =>
    watch?.(ValidationType.EMAIL_ALREADY_EXISTS) === true
      ? i18n.t('validation.emailAlreadyExists')
      : true,
  minimumZero: (value = '') => {
    if (!isEmpty(value)) {
      return (
        (NUMBER_ONLY.test(value) && Number(value) > 0) ||
        i18n.t('validation.retryLimit')
      )
    }
    return true
  },
  dobNormal: (value) =>
    getAge(value) > JuvenileAge.NORMAL || i18n.t('validation.dobCaseType'),
  dobJuvenile: (value) =>
    (getAge(value) <= JuvenileAge.NORMAL &&
      getAge(value) >= JuvenileAge.MINUS_7) ||
    i18n.t('validation.dobCaseType'),
  dobJuvenileMinus7: (value) =>
    getAge(value) <= JuvenileAge.MINUS_7 || i18n.t('validation.dobCaseType'),
  dobCC: (value) =>
    getAge(value) > JuvenileAge.SEVENTEEN || i18n.t('validation.dobCaseType'),
  confirmPassword: (value) =>
    watch?.('password') === value || i18n.t('validation.confirmPassword'),
  /** @deprecated should check from keycloak's password policy */
  deprecatedUserPassword: validateRules([
    {
      rule: (value = '') => /\d/.test(value),
      message: 'validation.atLeastOneNumber',
    },
    {
      rule: (value = '') => /[a-z]/.test(value),
      message: 'validation.atLeastOneLowerCase',
    },
    {
      rule: (value = '') => /[A-Z]/.test(value),
      message: 'validation.atLeastOneUpperCase',
    },
    {
      rule: (value = '') => /^.{8,64}$/.test(value),
      message: 'validation.passwordLength',
      tOptions: { min: 8, max: 64 },
    },
    {
      rule: (value = '') => !/[\s$\\'"`]/.test(value),
      message: 'validation.pdfPasswordBlacklistedChar',
    },
  ]),
  pdfPassword: validateRules([
    {
      rule: (value = '') => value.length >= 6,
      message: 'validation.minPasswordLength',
      tOptions: { min: 6 },
    },
    {
      rule: (value = '') => value.length <= 64,
      message: 'validation.maxPasswordLength',
      tOptions: { max: 64 },
    },
    {
      rule: (value = '') => !/[\s$\\'"`]/.test(value),
      message: 'validation.pdfPasswordBlacklistedChar',
    },
  ]),
})

export interface PositionOption {
  key: string
  label: string
  value: PositionConfig
}

export const getPositionOptions = (client: Client): Options<PositionOption> => {
  const positions = getMasterData('positions', client)
  return Object.keys(positions).reduce(
    (options: PositionOption[], positionKey) => {
      const { position } = positions[positionKey]
      const { key } = position
      const label = getMasterdataTranslation(position)
      if (!key || !label) return options
      return [
        ...options,
        {
          key,
          label,
          value: positions[positionKey],
        },
      ]
    },
    []
  )
}

export const getValidations = (
  validations?: ValidationType[],
  watch?: UseFormWatch<FieldValues>
): FieldValidations => {
  if (!validations) return {} as FieldValidations
  const validates = getAllFieldValidations(watch)
  return validations.reduce(
    (prev, current) =>
      validates[current]
        ? {
            ...prev,
            [current]: validates[current],
          }
        : prev,
    {} as FieldValidations
  )
}

const notificationFields: FieldConfig[] = [
  {
    type: FieldType.TEXT,
    key: 'phoneNumber',
  },
  {
    type: FieldType.TEXT,
    key: 'email',
  },
  {
    type: FieldType.TEXT,
    key: 'notifyType',
  },
]

interface SpecialFieldParsing {
  key: string
  parse: (fields: FieldConfig[], client: Client) => FieldConfig[]
}

const specialFieldParsing: SpecialFieldParsing[] = [
  {
    key: 'notification',
    parse: (fields: FieldConfig[]) => {
      const noNotification = fields.every(
        (f) => f.type !== FieldType.NOTIFICATION
      )
      if (noNotification) return fields
      const noNotificationFields = fields.filter(
        (f) => f.type !== FieldType.NOTIFICATION
      )
      return [...noNotificationFields, ...notificationFields]
    },
  },
  {
    key: 'position',
    parse: (fields, client) => [
      {
        key: 'position',
        type: FieldType.DROPDOWN,
        options: getPositionOptions(client)?.map(
          ({ value }) => value?.position
        ),
      },
      ...fields,
    ],
  },
]

export const getAllCreateLinkFormFields = (
  client: Client,
  options = { discardHiddenFields: true }
) => {
  const { discardHiddenFields } = options
  const createLinkForms = getMasterData('createLinkForms', client) as Record<
    string,
    CreateLinkFormConfig
  >
  const forms = Object.values(createLinkForms)
  const uniqueFields = forms.reduce((acc, curr) => {
    const accKeys = acc.map((a) => a.key).concat('position')
    const newFields: FieldConfig[] = [...(curr.fields ?? [])].filter(
      (field) => {
        if (field.hidden && discardHiddenFields) return false
        return !accKeys.includes(field.key)
      }
    )
    return [...acc, ...newFields]
  }, [] as FieldConfig[])
  return specialFieldParsing.reduce(
    (acc, curr) => curr.parse(acc, client),
    uniqueFields
  )
}
