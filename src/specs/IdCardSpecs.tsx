import classNames from 'classnames'
import { Verification } from 'types/caseKeeperCore'
import { TableSpec } from 'types/generic/table'
import {
  BackIdCardCompareFields,
  FrontIdCardCompareFields,
  FrontIdCardErrorCode,
  FrontIdCardResult,
  IdCardResult,
} from 'types/kycCore'
import i18n from 'i18n'
import { ENGLISH_ALPHABET, THAI_ALPHABET } from 'utils/regex'
import {
  addRestrictedAgeSuffix,
  dateFormat,
  formatDob,
  getDateWithExpiredSuffix,
  parseOcrDobValue,
} from 'utils/date'
import {
  hasErrorKey,
  hasFailedReasons,
  isValidLifeLongDate,
} from 'utils/validation'
import { capitalizeFirstLetter } from 'utils/common'
import { maskCitizenId } from 'utils/string'
import { dateFormats } from 'config/dateFormats'

interface IdCardTableData {
  header: string | null
  initial?: string | null
  edit?: string | null
  ocr?: string | null
  isValid?: boolean
}

const renderValueWithClassNames = (
  value: string | undefined,
  isValid?: boolean
) => (
  <div className={classNames(isValid && 'text-error')}>
    {value ? i18n.t(value) : '-'}
  </div>
)

export const idCardSpace: TableSpec[] = [
  {
    key: 'header',
    header: '',
    headerClassName: 'rounded-l-lg',
    renderValue: ({ isValid, header }) =>
      renderValueWithClassNames(header, isValid),
  },
  {
    key: 'initial',
    header: 'caseDetail.verification.headers.initial',
    contentClassName: 'text-center',
    headerClassName: 'text-center',
    renderValue: ({ initial }) => renderValueWithClassNames(initial),
  },
  {
    key: 'ocr',
    header: 'caseDetail.verification.headers.ocr',
    contentClassName: 'text-center',
    headerClassName: 'text-center',
    renderValue: ({ ocr }) => renderValueWithClassNames(ocr),
  },
  {
    key: 'edit',
    header: 'caseDetail.verification.headers.edit',
    headerClassName: 'rounded-r-lg text-center',
    contentClassName: 'text-center',
    renderValue: ({ edit }) => renderValueWithClassNames(edit),
  },
]

export const getFrontIdCardTableData = (
  verification: Verification,
  frontIdCardResult: FrontIdCardResult
): IdCardTableData[] | undefined => {
  const {
    title,
    citizenId,
    dateOfBirth,
    firstName,
    middleName,
    lastName,
    frontIdCardConfig,
  } = verification || {}

  const { response, edits, failedReasons } = frontIdCardResult || {}

  return [
    {
      header: FrontIdCardCompareFields.CITIZEN_ID,
      initial: maskCitizenId(citizenId),
      ocr: maskCitizenId(response?.result?.id_number),
      edit: maskCitizenId(edits?.citizenId),
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.CITIZEN_ID,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.TITLE,
      initial: title?.translations?.[i18n.language]?.label,
      ocr: response?.result?.[`title_${i18n.language}`],
      edit: edits?.[`title${capitalizeFirstLetter(i18n.language)}`],
      isValid: hasFailedReasons(FrontIdCardCompareFields.TITLE, failedReasons),
    },
    {
      header: FrontIdCardCompareFields.FIRST_NAME_TH,
      initial: firstName && THAI_ALPHABET.test(firstName) && firstName,
      ocr: response?.result?.first_name_th,
      edit: edits?.firstNameTh,
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.FIRST_NAME_TH,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.MIDDLE_NAME_TH,
      initial: middleName && THAI_ALPHABET.test(middleName) && middleName,
      ocr: response?.result?.middle_name_th,
      edit: edits?.middleNameTh,
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.MIDDLE_NAME_TH,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.LAST_NAME_TH,
      initial: lastName && THAI_ALPHABET.test(lastName) && lastName,
      ocr: response?.result?.last_name_th,
      edit: edits?.lastNameTh,
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.LAST_NAME_TH,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.FIRST_NAME_EN,
      initial: firstName && ENGLISH_ALPHABET.test(firstName) && firstName,
      ocr: response?.result?.first_name_en,
      edit: edits?.firstNameEn,
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.FIRST_NAME_EN,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.MIDDLE_NAME_EN,
      initial: middleName && ENGLISH_ALPHABET.test(middleName) && middleName,
      ocr: response?.result?.middle_name_en,
      edit: edits?.middleNameEn,
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.MIDDLE_NAME_EN,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.LAST_NAME_EN,
      initial: lastName && ENGLISH_ALPHABET.test(lastName) && lastName,
      ocr: response?.result?.last_name_en,
      edit: edits?.lastNameEn,
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.LAST_NAME_EN,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.DATE_OF_BIRTH,
      initial: dateOfBirth ? formatDob(dateOfBirth.split('T')[0]) : undefined,
      ocr: addRestrictedAgeSuffix(
        parseOcrDobValue(response?.result?.date_of_birth_en),
        frontIdCardConfig
      ),
      edit: addRestrictedAgeSuffix(
        parseOcrDobValue(edits?.dateOfBirth),
        frontIdCardConfig
      ),
      isValid:
        hasErrorKey(frontIdCardResult, FrontIdCardErrorCode.RESTRICTED_AGE) ??
        hasFailedReasons(FrontIdCardCompareFields.DATE_OF_BIRTH, failedReasons),
    },
    {
      header: FrontIdCardCompareFields.ADDRESS,
      initial: null,
      ocr: response?.result?.address_th,
      edit: edits?.address,
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.ADDRESS,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.ISSUE_DATE,
      initial: null,
      ocr: dateFormat(
        response?.result?.date_of_issue_en,
        dateFormats.displayDate
      ),
      edit: dateFormat(edits?.issueDate, dateFormats.displayDate),
      isValid: hasFailedReasons(
        FrontIdCardCompareFields.ISSUE_DATE,
        failedReasons
      ),
    },
    {
      header: FrontIdCardCompareFields.EXPIRY_DATE,
      initial: null,
      ocr: getDateWithExpiredSuffix(response?.result?.date_of_expiry_en),
      edit: getDateWithExpiredSuffix(edits?.expiryDate),
      isValid:
        (!isValidLifeLongDate(response?.result?.date_of_expiry_en) &&
          hasErrorKey(frontIdCardResult, FrontIdCardErrorCode.EXPIRED)) ||
        hasFailedReasons(FrontIdCardCompareFields.EXPIRY_DATE, failedReasons),
    },
  ]
}

export const getBackIdCard = (result: IdCardResult) => {
  return [
    {
      header: BackIdCardCompareFields.LASER_CODE,
      initial: null,
      ocr: result?.response?.result?.laser_code,
      edit: result?.edits?.laser,
      isValid: null,
    },
  ]
}
