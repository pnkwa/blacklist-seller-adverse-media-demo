/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import i18n from 'i18next'
import moment, { MomentInput } from 'moment'
import { DateRangeValue } from 'types/generic'
import { VerifyConfig } from 'types/kycCore'
import { dateFormats } from 'config/dateFormats'
import { addConditionalSuffixes, range } from './common'
import {
  isAboutToExpired,
  isExpired,
  isRestrictedAge,
  isValidLifeLongDate,
} from './validation'

export const dateFormat = (
  dateInput: MomentInput | MomentInput[],
  format = dateFormats.dayMonthYear,
  defaultValue: string | null = null,
  inputFormat?: string
) => {
  if (Array.isArray(dateInput)) {
    const delimeter = ' - '
    const formatedDates: string[] | null = dateInput.map((di: MomentInput) =>
      dateFormat(di, format, '-')
    )
    const emptyIndex = formatedDates.indexOf('-')
    if (emptyIndex < 0) return formatedDates.join(delimeter)
    return formatedDates.slice(0, emptyIndex).join(delimeter) || '-'
  }

  if (!dateInput) return defaultValue
  return moment(dateInput, inputFormat)
    .locale(i18n.language)
    .add(i18n.language === 'th' ? 543 : 0, 'year')
    .format(format)
}

const getDateValueString = (
  year: number | string | undefined | null,
  month: number | string | undefined | null,
  date: number | string | undefined | null
) => {
  const m = (month || 0)?.toString().padStart(2, '0')
  const d = (date || 0)?.toString().padStart(2, '0')
  return `${year}-${m}-${d}`
}

// '0 Jan. 1999' => '1999-01-00'
export const parseOcrDobValue = (value: string | undefined) => {
  if (!value) return undefined
  const ocrValue = value.split(' ').reverse()
  if (ocrValue.length === 1) return `${ocrValue[0]}-00-00`
  const [year, m, date] = ocrValue
  const locale = moment.locale()
  moment.locale('en')
  const month = moment(m, 'MMM.').month() + 1
  moment.locale(locale)
  return getDateValueString(year, month, date)
}

// '1999-01-00' => '- ม.ค. 2542'
export const formatDob = (value?: string) => {
  if (!value) return undefined
  const [year, month, date] = value.toString().split('-')

  return [
    date === '00' ? '-' : date,
    month === '00'
      ? '-'
      : moment(month, 'MM').locale(i18n.language).format('MMM'),
    i18n.language === 'th' ? (Number(year) + 543).toString() : year,
  ].join(' ')
}

export const getValueString = (
  year: number | undefined | null,
  month: number | undefined | null,
  date: number | undefined | null
) => {
  const m = month?.toString().padStart(2, '0')
  const d = date?.toString().padStart(2, '0')
  return `${year}-${m}-${d}`
}

export const getYears = (length?: number) =>
  range(
    moment().year() - (length || 150),
    moment().add(1, 'years').year()
  ).reverse()

export const getDateWithExpiredSuffix = (
  expiryDate: string | null | undefined,
  options?: {
    inputFormat?: string
    expiryThreshold?: string
  }
) => {
  if (isValidLifeLongDate(expiryDate)) return i18n.t('generic.lifeLong')
  const { inputFormat, expiryThreshold } = options ?? {}
  return addConditionalSuffixes({
    value: expiryDate,
    formatValue: () =>
      dateFormat(expiryDate, dateFormats.displayDate, null, inputFormat),
    suffixes: [
      (value) => {
        if (isExpired(value)) return `(${i18n.t('generic.expired')})`
        if (expiryThreshold && isAboutToExpired(value, expiryThreshold))
          return '(About to expired)'
        return undefined
      },
    ],
  })
}

export const addRestrictedAgeSuffix = (
  dateOfBirth: string | null | undefined,
  config?: VerifyConfig
) =>
  addConditionalSuffixes({
    value: dateOfBirth,
    formatValue: formatDob,
    suffixes: [
      (value) => isRestrictedAge(value, config?.minimumAge) && '(Immature)',
    ],
  })

export const getPreviousPeriodDateRange = (
  currentPeriod: DateRangeValue
): DateRangeValue => {
  const [start, end] = currentPeriod
  if (!start || !end) return [undefined, undefined]

  const diff = moment(end).diff(start) // Calculate difference between end and start
  const newEnd = moment(start).subtract(1, 'millisecond').toISOString() // Adjust the end date
  const newStart = moment(newEnd)
    .subtract(diff, 'milliseconds') // Use milliseconds as the unit of measurement
    .toISOString()

  return [newStart, newEnd]
}

/**
 * Generates a temporal duration array starting from P1M to the specified number of years (maxYears),
 * with each item incrementing by 1 month.
 * @param {number} maxYears - The maximum number of years for the generated array.
 * @returns {string[]} An array of temporal duration strings.
 */
export const generateTemporalArray = (maxYears: number): string[] => {
  const durations: string[] = []
  for (let years = 0; years <= maxYears - 1; years++) {
    for (let months = 0; months < 12; months++) {
      let duration = 'P'
      // eslint-disable-next-line no-continue
      if (!years && !months) continue
      if (years > 0) duration += `${years}Y`
      if (months > 0) duration += `${months}M`
      durations.push(duration)
    }
  }
  durations.push(`P${maxYears}Y`)
  return durations
}
