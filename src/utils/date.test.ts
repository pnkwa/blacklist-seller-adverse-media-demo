import moment, { Moment } from 'moment'
import { DateRangeValue } from 'types/generic'
import i18n from 'i18n'
import { dateFormats } from 'config/dateFormats'
import {
  dateFormat,
  formatDob,
  generateTemporalArray,
  getPreviousPeriodDateRange,
  parseOcrDobValue,
} from './date'

describe('getPreviousPeriodDateRange function', () => {
  it('should return correct previous period date range', () => {
    const currentPeriod: DateRangeValue = [
      '2023-12-15T17:00:00.000Z',
      '2023-12-22T16:59:59.999Z',
    ]
    const expectedPreviousPeriod: DateRangeValue = [
      '2023-12-08T17:00:00.000Z',
      '2023-12-15T16:59:59.999Z',
    ]
    const result = getPreviousPeriodDateRange(currentPeriod)
    expect(result).toEqual(expectedPreviousPeriod)
  })

  it('should handle undefined values', () => {
    const currentPeriod: DateRangeValue = [
      undefined,
      '2023-12-21T00:00:00.000Z',
    ]
    const expectedPreviousPeriod: DateRangeValue = [undefined, undefined]
    const result = getPreviousPeriodDateRange(currentPeriod)
    expect(result).toEqual(expectedPreviousPeriod)
  })
})

describe('parseOcrDobValue', () => {
  it('null should return ', () => {
    expect(parseOcrDobValue('')).toBeUndefined()
  })

  it('9 1999 should return 1999-00-00', () => {
    expect(parseOcrDobValue('9 1999')).toEqual('1999-00-00')
  })

  it('1999 should return 1999-00-00', () => {
    expect(parseOcrDobValue('1999')).toEqual('1999-00-00')
  })

  it('Nov. 1999 should return 1999-11-00', () => {
    expect(parseOcrDobValue('Nov. 1999')).toEqual('1999-11-00')
  })

  it('1 1999 should return 1999-00-01', () => {
    expect(parseOcrDobValue('9 1999')).toEqual('1999-00-00')
  })

  it('0 Jan. 1999 should return 1999-00-00', () => {
    expect(parseOcrDobValue('0 Jan. 1999')).toEqual('1999-01-00')
  })

  it('09 Feb. 2000 should return 2000-02-09', () => {
    expect(parseOcrDobValue('09 Feb. 2000')).toEqual('2000-02-09')
  })

  it('24 Feb. 1999 should return 1999-02-24', () => {
    expect(parseOcrDobValue('24 Feb. 1999')).toEqual('1999-02-24')
  })
})

describe('formatDob function', () => {
  i18n.language = 'en'
  it('should return undefined for undefined input', () => {
    const result = formatDob(undefined)
    expect(result).toBeUndefined()
  })

  it('should format date of birth correctly', () => {
    const result = formatDob('1990-12-31')
    expect(result).toBe('31 Dec 1990')
  })

  it('should handle date with "00" value', () => {
    const result = formatDob('1990-12-00')
    expect(result).toBe('- Dec 1990')
  })

  it('should handle date with "03" value', () => {
    const result = formatDob('1990-12-03')
    expect(result).toBe('03 Dec 1990')
  })

  it('should handle month with "00" value', () => {
    const result = formatDob('1990-00-31')
    expect(result).toBe('31 - 1990')
  })

  it('should handle Thai language correctly', () => {
    i18n.language = 'th'
    const result = formatDob('1990-12-31')
    expect(result).toBe('31 ธ.ค. 2533')
  })
})

describe('dateFormat function', () => {
  it('should return "-" for undefined input', () => {
    i18n.language = 'en'
    const result = dateFormat(undefined, undefined, '-')
    expect(result).toBe('-')
  })

  it('should return null for undefined input', () => {
    const result = dateFormat(undefined)
    expect(result).toBe(null)
  })

  it('should format a single date correctly', () => {
    const inputDate = moment('2022-01-18')
    const result = dateFormat(inputDate)
    expect(result).toBe('18/01/2022')
  })

  it('should format an array of dates correctly', () => {
    const inputDates = [
      moment('2022-01-18'),
      moment('2022-01-19'),
      moment('2022-01-20'),
    ]
    const result = dateFormat(inputDates)
    expect(result).toBe('18/01/2022 - 19/01/2022 - 20/01/2022')
  })

  it('should handle inputFormat correctly', () => {
    const result = dateFormat(
      '18-01-2022',
      dateFormats.displayDate,
      '-',
      'D-MM-YYYY'
    )
    expect(result).toBe('18 Jan 2022')
  })

  it('should handle empty date in the array correctly', () => {
    const inputDates: (Moment | null)[] = [
      moment('2022-01-18'),
      null,
      moment('2022-01-20'),
    ]
    const result = dateFormat(inputDates, dateFormats.displayDate)
    expect(result).toBe('18 Jan 2022')
  })

  it('should handle Thai language correctly', () => {
    i18n.language = 'th'
    const inputDate = moment('2022-01-18')
    const result = dateFormat(inputDate, dateFormats.displayDate)
    expect(result).toBe('18 ม.ค. 2565')
  })
})

describe('generateTemporalArray', () => {
  it('should return array of temporal duration (1 year)', () => {
    const temporalArray = generateTemporalArray(1)
    const expectedArray = [
      'P1M',
      'P2M',
      'P3M',
      'P4M',
      'P5M',
      'P6M',
      'P7M',
      'P8M',
      'P9M',
      'P10M',
      'P11M',
      'P1Y',
    ]

    expect(temporalArray).toEqual(expectedArray)
  })

  it('should return array of temporal duration (2 years)', () => {
    const temporalArray = generateTemporalArray(2)
    const expectedArray = [
      'P1M',
      'P2M',
      'P3M',
      'P4M',
      'P5M',
      'P6M',
      'P7M',
      'P8M',
      'P9M',
      'P10M',
      'P11M',
      'P1Y',
      'P1Y1M',
      'P1Y2M',
      'P1Y3M',
      'P1Y4M',
      'P1Y5M',
      'P1Y6M',
      'P1Y7M',
      'P1Y8M',
      'P1Y9M',
      'P1Y10M',
      'P1Y11M',
      'P2Y',
    ]

    expect(temporalArray).toEqual(expectedArray)
  })
})
