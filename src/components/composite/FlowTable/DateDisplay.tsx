import { dateFormats } from 'config/dateFormats'
import { dateFormat } from 'utils/date'

interface DateDisplayProps {
  value: string | null | undefined
  formatValue?: (value: string) => string
}

/**
 * a component that format and displays the given date, also have date&time in the tooltip
 * and render a placeholder when value is empty
 */
export const DateDisplay = ({ value, formatValue }: DateDisplayProps) => {
  if (!value) return <span>-</span>

  return (
    <span title={dateFormat(value, dateFormats.dayMonthYearDateTime)}>
      {formatValue?.(value) ?? dateFormat(value, dateFormats.displayDate)}
    </span>
  )
}
