import moment from 'moment'
import { BackgroundCheckStatus } from 'types/bgcCore'
import { DateRangeValue, Filter } from 'types/generic'

export const baseFilter: Filter = {
  'verificationId-$not-$isNull': '',
  'backgroundCheckId-$not-$isNull': '',
}

export const getInitialCreatedAtRange = (): DateRangeValue => [
  moment().subtract(6, 'days').startOf('day').toISOString(), // defaults to 7 days ago
  moment().endOf('day').toISOString(),
]

export const dateRangeToFilter = (
  filterKey: string,
  dateRange: DateRangeValue
): Filter => {
  const [startDate, endDate] = dateRange
  const start = startDate ? moment(startDate).toISOString() : undefined
  const end = endDate ? moment(endDate).toISOString() : undefined
  if (start && end) return { [`${filterKey}-$between`]: `${start},${end}` }
  if (start && !end) return { [`${filterKey}-$moreThan`]: start }
  if (!start && end) return { [`${filterKey}-$lessThanOrEqual`]: end }
  return {
    [`${filterKey}-$between`]: undefined,
    [`${filterKey}-$moreThan`]: undefined,
    [`${filterKey}-$lessThanOrEqual`]: undefined,
  }
}

export const getCreatedAtFilter = (value: DateRangeValue | undefined): Filter =>
  dateRangeToFilter('createdAt', value ?? [undefined, undefined])

export const getBGCStatusFilter = (
  statuses: BackgroundCheckStatus[]
): Filter => ({
  'backgroundCheck-status-$in': statuses.join(','),
})
