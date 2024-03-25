import { DateRangeValue } from 'types/generic'
import { dateRangeToFilter } from './filter'

describe('dateRangeToFilter function', () => {
  const filterKey = 'yourFilterKey'

  it('returns correct filter for complete date range', () => {
    const dateRange: DateRangeValue = [
      '2023-12-20T00:00:00.000Z',
      '2023-12-21T23:59:59.999Z',
    ]
    const expectedFilter = {
      [`${filterKey}-$between`]:
        '2023-12-20T00:00:00.000Z,2023-12-21T23:59:59.999Z',
    }
    const result = dateRangeToFilter(filterKey, dateRange)
    expect(result).toEqual(expectedFilter)
  })

  it('returns correct filter for start date only', () => {
    const startDate = '2023-12-20T00:00:00.000Z'
    const dateRange: DateRangeValue = [startDate, undefined]
    const expectedFilter = {
      [`${filterKey}-$moreThan`]: '2023-12-20T00:00:00.000Z',
    }
    const result = dateRangeToFilter(filterKey, dateRange)
    expect(result).toEqual(expectedFilter)
  })

  it('returns correct filter for end date only', () => {
    const endDate = '2023-12-21T23:59:59.999Z'
    const dateRange: DateRangeValue = [undefined, endDate]
    const expectedFilter = {
      [`${filterKey}-$lessThanOrEqual`]: '2023-12-21T23:59:59.999Z',
    }
    const result = dateRangeToFilter(filterKey, dateRange)
    expect(result).toEqual(expectedFilter)
  })

  it('returns empty filter for undefined date range', () => {
    const dateRange: DateRangeValue = [undefined, undefined]
    const expectedFilter = {
      [`${filterKey}-$between`]: undefined,
      [`${filterKey}-$moreThan`]: undefined,
      [`${filterKey}-$lessThanOrEqual`]: undefined,
    }
    const result = dateRangeToFilter(filterKey, dateRange)
    expect(result).toEqual(expectedFilter)
  })
})
