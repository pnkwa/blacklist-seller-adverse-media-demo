import moment, { MomentInput } from 'moment'
import { dateFormats } from 'config/dateFormat'

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
  return moment(dateInput, inputFormat).format(format)
}
