import moment from 'moment'
import i18n from 'i18next'
import { FC, useCallback, useMemo, useState } from 'react'
import { Control, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { months } from 'types/generic'
import { getValueString, getYears } from 'utils/date'
import { range } from 'utils/common'
import { InputSelect } from './InputSelect'

export const DateDropdownField: FC<{
  onChange: (value: string | undefined) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<FieldValues, any>
  value?: string
}> = ({ onChange, control, value }) => {
  const { t } = useTranslation()

  const [existYear, existMonth, existDate] = value?.split('-') ?? []

  const [date, setDate] = useState<number | null>(parseInt(existDate, 10))
  const [month, setMonth] = useState<number | null>(parseInt(existMonth, 10))
  const [year, setYear] = useState<number | null>(parseInt(existYear, 10))
  const isThaiLang = i18n.language === 'th'

  const getDaysInMonth = useCallback(
    (month?: number | null) =>
      month
        ? moment(`${year}-${month === 0 ? 1 : month}`, 'YYYY-MM').daysInMonth()
        : 31,
    [year]
  )

  const yearOptions = useMemo(
    () =>
      getYears().map((value) => ({
        label: isThaiLang ? value + 543 : value,
        value,
      })),
    [isThaiLang]
  )

  const monthOptions = useMemo(
    () =>
      months.map((value, index) => ({
        label: index === 0 ? '-' : t(`months.${value}`),
        value: index === 0 ? 0 : index,
      })),
    [t]
  )

  const dateOptions = useMemo(() => {
    const dates = range(0, getDaysInMonth(month) + 1)
    return dates.map((value, index) => ({
      label: index === 0 ? '-' : value,
      value: index === 0 ? 0 : value,
    }))
  }, [getDaysInMonth, month])

  const onYearChange = useCallback(
    ({ value }) => {
      setYear(value)
      onChange(getValueString(value, month, date))
    },
    [date, month, onChange]
  )

  const onMonthChange = useCallback(
    ({ value }) => {
      setMonth(value)

      if (date && date > getDaysInMonth(value)) {
        setDate(null)
        onChange(getValueString(year, value, undefined))
      } else {
        onChange(getValueString(year, value, date))
      }
    },
    [date, getDaysInMonth, onChange, year]
  )

  const onDateChange = useCallback(
    ({ value }) => {
      setDate(value)
      onChange(getValueString(year, month, value))
    },
    [month, onChange, year]
  )

  return (
    <div className="grid grid-cols-12 gap-x-2 sm:gap-x-4">
      <InputSelect
        control={control}
        options={dateOptions}
        value={dateOptions.find((v) => v.value === date) ?? null}
        placeholder={t('months.placeholder.day')}
        onChange={onDateChange}
        className="col-span-4"
        name="day"
      />
      <InputSelect
        control={control}
        options={monthOptions}
        value={monthOptions.find((v) => v.value === month) ?? null}
        placeholder={t('months.placeholder.month')}
        onChange={onMonthChange}
        className="col-span-4"
        name="month"
      />
      <InputSelect
        control={control}
        options={yearOptions}
        value={yearOptions.find((v) => v.value === year)}
        placeholder={t('months.placeholder.year')}
        onChange={onYearChange}
        className="col-span-4"
        name="year"
      />
    </div>
  )
}
