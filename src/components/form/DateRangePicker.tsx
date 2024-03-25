import moment from 'moment'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { DateRangePicker as DateRangePickerLib, Range } from 'react-date-range'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCaretLeft,
  faCaretRight,
  faChevronDown,
  faChevronUp,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import * as rdrLocales from 'react-date-range/dist/locale'
import CalendarIcon from 'assets/svg/icon-calendar.svg?react'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { getDateLabel, staticRanges } from 'utils/datePicker'
import { DateRangeValue } from 'types/generic'
import { TooltipBox } from 'components/base/TooltipBox'
import { useOnClickOutside } from 'hooks/clickOutside'
import { dateFormats } from 'config/dateFormats'
import { dateFormat } from 'utils/date'
import { range } from 'utils/common'
import { Dropdown, defaultDropdownClassNames } from 'components/base/Dropdown'

const toRange = (value: DateRangeValue | undefined): Range => {
  const [start, end] = value ?? []
  return {
    key: 'selection',
    startDate: start ? moment(start).startOf('day').toDate() : undefined,
    endDate: end ? moment(end).endOf('day').toDate() : undefined,
  }
}

const rangeToValue = (range: Range): DateRangeValue => [
  range.startDate
    ? moment(range.startDate).startOf('date').toISOString()
    : undefined,
  range.endDate ? moment(range.endDate).endOf('date').toISOString() : undefined,
]

interface DatePickerProps {
  value?: DateRangeValue
  defaultValue?: DateRangeValue
  onSubmitDate?: (value: DateRangeValue) => void
  className?: string
  minDate?: Date
  maxDate?: Date
}

export const DateRangePicker = ({
  value,
  defaultValue,
  onSubmitDate,
  className,
  minDate,
  maxDate = moment().toDate(),
}: DatePickerProps) => {
  const { t, i18n } = useTranslation()
  const { client } = useTenantConfigContext()

  const [enabled, setEnabled] = useState<boolean>(false)
  const [resultValue, setResultValue] = useState<DateRangeValue>(
    () => value ?? defaultValue ?? [undefined, undefined]
  )
  const [selectedRange, setSelectedRange] = useState<Range>(() =>
    toRange(defaultValue)
  )

  const ref = useRef<HTMLDivElement>(null)

  const showClearButton =
    !moment(resultValue[0]).isSame(defaultValue?.[0]) ||
    !moment(resultValue[1]).isSame(defaultValue?.[1])

  const renderStaticRangeLabel = (range) => (
    <div>{t(`datePicker.${range.label}`)}</div>
  )

  const clearDate = (e) => {
    e.stopPropagation()
    const newValue: DateRangeValue = defaultValue ?? [undefined, undefined]
    setResultValue(newValue)
    setSelectedRange(toRange(newValue))
    if (onSubmitDate) onSubmitDate(newValue)
    setEnabled(false)
  }

  useEffect(() => {
    setResultValue(value ?? [undefined, undefined])
  }, [value])

  useOnClickOutside(ref, () => setEnabled(false))

  const maxYear = maxDate ? moment(maxDate).diff(moment(), 'years') : ''
  const minYear = minDate ? moment().diff(moment(minDate), 'years') : ''

  const yearOptions = useMemo(() => {
    const years = range(
      moment().year() - (minYear || 100),
      moment().year() + (maxYear || 1)
    ).reverse()
    return years.map((value) => ({
      label: i18n.language === 'th' ? value + 543 : value,
      value,
    }))
  }, [i18n.language, maxYear, minYear])

  const monthOptions = useMemo(
    () =>
      moment.months(i18n.language).map((month, index) => ({
        key: month,
        label: month,
        value: index,
      })),
    [i18n.language]
  )

  return (
    <TooltipBox
      show={enabled}
      ref={ref}
      containerClassName=" sm:max-w-[560px]  !right-8"
      tooltipClassName="!max-w-none p-0"
      tooltipContent={
        <div className={classNames('z-50 mt-2')}>
          <DateRangePickerLib
            className="border rounded-xl relative pb-8 bg-white"
            onChange={(value) => {
              setSelectedRange(value.selection)
            }}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={[selectedRange]}
            rangeColors={[client?.theme?.primary ?? '#AE0736']}
            renderStaticRangeLabel={renderStaticRangeLabel}
            direction="horizontal"
            maxDate={maxDate}
            minDate={minDate}
            staticRanges={staticRanges}
            locale={rdrLocales?.[i18n.language]}
            showDateDisplay={false}
            navigatorRenderer={(curr, change, props) => (
              <>
                <div className="flex space-x-2 p-2 bg-base-300">
                  <div
                    className={classNames(
                      'flex justify-center items-center text-sm rounded-lg font-normal bg-base-100',
                      'h-10 flex-1'
                    )}
                  >
                    {dateFormat(
                      props.ranges?.[0].startDate,
                      dateFormats.dateDatePicker
                    )}
                  </div>
                  <div
                    className={classNames(
                      'flex justify-center items-center text-sm rounded-lg font-normal bg-base-100',
                      'h-10 flex-1'
                    )}
                  >
                    {dateFormat(
                      props.ranges?.[0].endDate,
                      dateFormats.dateDatePicker
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center space-x-2 px-2 pt-2">
                  <button
                    aria-hidden
                    type="button"
                    className="btn btn-sm btn-ghost rounded-full"
                    onClick={() => change(-1, 'monthOffset')}
                  >
                    <FontAwesomeIcon icon={faCaretLeft} />
                  </button>
                  <div className="flex-1 flex space-x-2">
                    <div
                      className="flex-1"
                      aria-hidden
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        classNames={{
                          ...defaultDropdownClassNames,
                          control: ({ isFocused }) =>
                            classNames(
                              '!cursor-pointer !text-center !rounded-lg !border-none',
                              isFocused &&
                                '!border-base-content/25 !ring-1 !ring-offset-1 !ring-base-content/25 !shadow-none'
                            ),
                        }}
                        components={{
                          IndicatorSeparator: () => null,
                          DropdownIndicator: () => null,
                        }}
                        options={monthOptions}
                        onChange={({ value }) => change(value, 'setMonth')}
                        value={monthOptions.find(
                          ({ value }) => value === curr.getMonth()
                        )}
                      />
                    </div>
                    <div
                      className="flex-1"
                      aria-hidden
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown
                        classNames={{
                          ...defaultDropdownClassNames,
                          control: ({ isFocused }) =>
                            classNames(
                              '!cursor-pointer !text-center !rounded-lg !border-none',
                              isFocused &&
                                '!border-base-content/25 !ring-1 !ring-offset-1 !ring-base-content/25 !shadow-none'
                            ),
                        }}
                        components={{
                          IndicatorSeparator: () => null,
                          DropdownIndicator: () => null,
                        }}
                        options={yearOptions}
                        onChange={({ value }) => change(value, 'setYear')}
                        value={yearOptions.find(
                          ({ value }) => value === curr.getFullYear()
                        )}
                      />
                    </div>
                  </div>
                  <button
                    aria-hidden
                    type="button"
                    className="btn btn-sm btn-ghost rounded-full"
                    onClick={() => change(1, 'monthOffset')}
                  >
                    <FontAwesomeIcon icon={faCaretRight} />
                  </button>
                </div>
              </>
            )}
          />
          <div className="absolute flex justify-end bottom-2 right-2 space-x-2">
            <button
              type="button"
              onClick={() => setEnabled(false)}
              className="btn btn-sm btn-outline"
            >
              {t('datePicker.close')}
            </button>
            <button
              type="button"
              onClick={() => {
                const newValue = rangeToValue(selectedRange)
                if (onSubmitDate) onSubmitDate(newValue)
                setResultValue(newValue)
                setEnabled(false)
              }}
              className="btn btn-sm btn-primary"
            >
              {t('datePicker.submit')}
            </button>
          </div>
        </div>
      }
    >
      <div
        aria-hidden
        className={classNames(
          'py-1 px-2 text-sm border rounded-lg bg-white',
          'cursor-pointer font-normal flex justify-between items-center w-full',
          className
        )}
        onClick={() => {
          setEnabled((prev) => {
            if (!prev) setSelectedRange(toRange(resultValue))
            return !prev
          })
        }}
      >
        <div className="flex space-x-2  items-center">
          <CalendarIcon className="left-2 w-4 h-4 text-neutral" />
          <p className={classNames(value && 'text-sm')}>
            {getDateLabel(resultValue) ?? t('datePicker.clear')}
          </p>
        </div>
        {showClearButton ? (
          <FontAwesomeIcon
            className="-m-2 p-2 hover:bg-gray-200 rounded-lg"
            icon={faXmark}
            onClick={clearDate}
          />
        ) : (
          <FontAwesomeIcon
            className="w-4"
            icon={enabled ? faChevronUp : faChevronDown}
          />
        )}
      </div>
    </TooltipBox>
  )
}
