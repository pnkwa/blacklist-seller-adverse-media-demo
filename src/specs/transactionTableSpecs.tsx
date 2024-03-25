import { TableSpec } from 'types/generic/table'
import { dateFormat } from 'utils/date'
import { dateFormats } from 'config/dateFormats'

export const transactionTableSpecs: TableSpec[] = [
  {
    key: 'dateTime',
    header: 'transaction.headers.dateTime',
    headerClassName: 'rounded-l-lg text-center',
    renderValue: (item) =>
      dateFormat(item.createdAt, dateFormats.dayMonthYearDateTime),
  },
  {
    key: 'transactionId',
    header: 'transaction.headers.transactionId',
    headerClassName: 'text-center',
    renderValue: (item) => item.id,
  },
  {
    key: 'transactionRule',
    header: 'transaction.headers.transactionRule',
    headerClassName: 'text-center',
    renderValue: (item) => item.transactionRule?.name,
  },
  {
    key: 'creditUsage',
    header: 'transaction.headers.creditUsage',
    headerClassName: 'text-center',
    renderValue: (item) => item.amount,
  },
]
