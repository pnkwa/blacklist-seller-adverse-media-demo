import moment from 'moment'
import { IdCardResult } from 'types/kycCore'
import { dateFormats } from 'config/dateFormats'

export const isValidLifeLongDate = (date?: string | null) => date === 'LIFELONG'

export const isExpired = (expiryDate: string | null | undefined) =>
  expiryDate && new Date() > new Date(expiryDate)

export const isAboutToExpired = (
  value: string | null | undefined,
  expiryThreshold?: string
) => expiryThreshold && moment().add(expiryThreshold).isSameOrAfter(value)

/**
 *
 * @param dateOfBirth date of birth in YYYY-MM-DD format. can be 1999-00-00 if day or month is unknown
 * @returns age in number
 */
const calculateAge = (dateOfBirth: string | undefined): number | undefined =>
  dateOfBirth
    ? moment().diff(
        moment(
          dateOfBirth.split('-').map((item) => (item === '00' ? '01' : item)),
          dateFormats.isoDate
        ),
        'years'
      )
    : undefined

export const hasErrorKey = (
  result: IdCardResult | null | undefined,
  key: string
) =>
  result?.errors?.some((item) => item.key === key) ??
  result?.response?.error === key

export const isRestrictedAge = (
  dateOfBirth: string,
  minimumAge: number | undefined
) => {
  if (!dateOfBirth || !minimumAge) return false
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return calculateAge(dateOfBirth)! < minimumAge
}

export const hasFailedReasons = (key: string, failedReasons?: string[]) =>
  failedReasons?.some((fr) => fr === key)

export const isRestrictCountry = (value?: string, blacklist?: string[]) => {
  if (!value || !blacklist?.length) return false
  return blacklist.some((b) => b === value)
}
