import moment from 'moment'
import { Verification } from 'types/caseKeeperCore'
import { PassportCompareFields, PassportErrorCode } from 'types/kycCore'
import {
  addRestrictedAgeSuffix,
  dateFormat,
  getDateWithExpiredSuffix,
} from 'utils/date'
import { hasErrorKey, hasFailedReasons } from 'utils/validation'
import { addNationalitySuffix } from 'utils/common'
import { dateFormats } from 'config/dateFormats'

export const getPassportDataTable = (
  verification: Verification
): Record<string, string | boolean | undefined | null>[] => {
  const {
    dateOfBirth,
    firstName,
    lastName,
    passportResult,
    passportNumber,
    passportConfig,
  } = verification || {}
  const { response, edits, ocrNationality, editNationality, failedReasons } =
    passportResult ?? {}
  const { expiryThreshold, countryCodeBlacklist } = passportConfig ?? {}
  return [
    {
      header: PassportCompareFields.PASSPORT_NUMBER,
      initial: passportNumber,
      ocr: response?.result?.mrz_passport_number?.replaceAll(' ', ''),
      edit: edits?.passportNumber,
      isValid: hasFailedReasons(
        PassportCompareFields.PASSPORT_NUMBER,
        failedReasons
      ),
    },
    {
      header: PassportCompareFields.FIRST_NAME,
      initial: firstName,
      ocr: response?.result?.mrz_given_name,
      edit: edits?.firstName,
      isValid: hasFailedReasons(
        PassportCompareFields.FIRST_NAME,
        failedReasons
      ),
    },
    {
      header: PassportCompareFields.MIDDLE_NAME,
      initial: null,
      ocr: null,
      edit: null,
      isValid: hasFailedReasons(
        PassportCompareFields.MIDDLE_NAME,
        failedReasons
      ),
    },
    {
      header: PassportCompareFields.LAST_NAME,
      initial: lastName,
      ocr: response?.result?.mrz_surname,
      edit: edits?.lastName,
      isValid: hasFailedReasons(PassportCompareFields.LAST_NAME, failedReasons),
    },
    {
      header: PassportCompareFields.GENDER,
      initial: null,
      ocr: response?.result?.mrz_sex,
      edit: edits?.gender,
    },
    {
      header: PassportCompareFields.ISSUING_STATE,
      initial: null,
      ocr: addNationalitySuffix(
        response?.result?.mrz_issuing_state,
        countryCodeBlacklist
      ),
      edit: addNationalitySuffix(edits?.issuingState, countryCodeBlacklist),
      isValid: hasErrorKey(
        passportResult,
        PassportErrorCode.RESTRICTED_COUNTRY
      ),
    },
    {
      header: PassportCompareFields.NATIONALITY,
      initial: null,
      ocr: addNationalitySuffix(
        response?.result?.mrz_nationality,
        countryCodeBlacklist,
        ocrNationality
      ),
      edit: addNationalitySuffix(
        edits?.nationality,
        countryCodeBlacklist,
        editNationality
      ),
      isValid: hasErrorKey(
        passportResult,
        PassportErrorCode.RESTRICTED_NATIONALITY
      ),
    },
    {
      header: PassportCompareFields.DATE_OF_BIRTH,
      initial: dateFormat(dateOfBirth, dateFormats.displayDate),
      ocr: addRestrictedAgeSuffix(
        moment(
          response?.result?.mrz_date_of_birth,
          dateFormats.passport
        ).format(dateFormats.isoDate),
        passportConfig
      ),
      edit: addRestrictedAgeSuffix(edits?.dateOfBirth, passportConfig),
      isValid:
        hasErrorKey(passportResult, PassportErrorCode.RESTRICTED_AGE) ||
        hasFailedReasons(PassportCompareFields.DATE_OF_BIRTH, failedReasons),
    },
    {
      header: PassportCompareFields.EXPIRY_DATE,
      initial: null,
      ocr: getDateWithExpiredSuffix(
        moment(
          response?.result?.mrz_date_of_expiry,
          dateFormats.passport
        ).toISOString(),
        { expiryThreshold }
      ),
      edit: getDateWithExpiredSuffix(edits?.dateOfExpiry, { expiryThreshold }),
      isValid:
        hasErrorKey(passportResult, PassportErrorCode.EXPIRED) ||
        hasErrorKey(passportResult, PassportErrorCode.ABOUT_TO_EXPIRE),
    },
  ]
}
