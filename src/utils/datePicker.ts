import { t } from 'i18next'
import moment from 'moment'
import { Preview, StaticRange, Range } from 'react-date-range'
import { dateFormats } from 'config/dateFormats'
import { DateRangeValue } from 'types/generic'
import i18n from 'i18n'

const checkSelected = (definedRange: Preview, range: Range) =>
  moment(definedRange.startDate).startOf('day').isSame(range.startDate) &&
  moment(definedRange.endDate).endOf('day').isSame(range.endDate)

export const staticRanges: StaticRange[] = [
  {
    label: 'today',
    hasCustomRendering: true,
    range: () => ({
      startDate: moment().startOf('day').toDate(),
      endDate: moment().endOf('day').toDate(),
    }),
    isSelected(range) {
      return checkSelected(this.range(), range)
    },
  },
  {
    label: 'yesterday',
    hasCustomRendering: true,
    range: () => ({
      startDate: moment().subtract(1, 'days').startOf('day').toDate(),
      endDate: moment().subtract(1, 'days').endOf('day').toDate(),
    }),
    isSelected(range) {
      return checkSelected(this.range(), range)
    },
  },
  {
    label: 'week',
    hasCustomRendering: true,
    range: () => ({
      startDate: moment().subtract(6, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate(),
    }),
    isSelected(range) {
      return checkSelected(this.range(), range)
    },
  },
  {
    label: 'twoWeek',
    hasCustomRendering: true,
    range: () => ({
      startDate: moment().subtract(13, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate(),
    }),
    isSelected(range) {
      return checkSelected(this.range(), range)
    },
  },
  {
    label: 'month',
    hasCustomRendering: true,
    range: () => ({
      startDate: moment().subtract(29, 'days').startOf('day').toDate(),
      endDate: moment().endOf('day').toDate(),
    }),
    isSelected(range) {
      return checkSelected(this.range(), range)
    },
  },
]

export const getDateLabel = ([startDate, endDate]: DateRangeValue) => {
  const range = staticRanges.find(
    ({ range }) =>
      moment(startDate).startOf('day').isSame(range().startDate) &&
      moment(endDate).endOf('day').isSame(range().endDate)
  )

  if (!startDate || !endDate) return undefined

  const start = moment(startDate)
    .add(i18n.language === 'th' ? 543 : 0, 'year')
    .format(dateFormats.displayDate)
  const end = moment(endDate)
    .add(i18n.language === 'th' ? 543 : 0, 'year')
    .format(dateFormats.displayDate)

  return `${start} - ${end} ${
    range ? `( ${t(`datePicker.${range.label}`)} )` : ''
  }`
}
