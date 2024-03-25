/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState, useRef, useEffect } from 'react'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { getIndexedId } from 'utils/element'
import { useOnClickOutside } from 'hooks/clickOutside'
import { getMasterdataTranslation } from 'utils/translations'
import { LegacyMasterdata, Masterdata } from 'types/generic'

interface DropdownItem<T> {
  key?: T | null
  translations?: any
}

interface DropdownProps<T> {
  placeholder: string
  options: DropdownItem<T>[]
  onChange?: (value: T | null) => void
  renderer?: (item: DropdownItem<T>) => ReactNode
  className?: string
  classNameIcon?: string
  isReset?: boolean
  onReset?: () => void
  defaultValue?: string
}

export const PositionDropdown: React.FC<DropdownProps<any>> = ({
  placeholder,
  options,
  renderer,
  onChange,
  className,
  classNameIcon,
  isReset,
  onReset,
  defaultValue,
}) => {
  const dropdownRef = useRef<HTMLUListElement>(null)
  const [value, setValue] = useState<DropdownItem<any> | null | undefined>(null)
  const [isShow, setShow] = useState(false)

  const onSelect = (item: DropdownItem<any>) => {
    setValue(item.key === null ? null : item)
    onChange?.(item.key)
  }

  useEffect(() => {
    if (defaultValue)
      setValue(options.find((item) => item.key === defaultValue))

    if (isReset) {
      setValue(null)
      onChange?.(null)
      onReset?.()
    }
  }, [defaultValue, isReset, onChange, onReset, options])

  useOnClickOutside(dropdownRef, () => setShow(false))
  const inputId = getIndexedId('status-dropdown')

  return (
    <button
      type="button"
      className={classNames(
        'h-full flex items-start text-xs',
        'relative',
        className
      )}
      onClick={() => setShow(!isShow)}
    >
      <div
        className={classNames(
          'flex items-center input input-primary',
          'border-base-300 focus:border-none text-xs',
          className ?? 'h-10 rounded-none',
          !value && 'text-gray-400'
        )}
      >
        <input
          id={inputId}
          readOnly
          className={classNames('border-none w-full')}
          placeholder={placeholder}
          value={
            getMasterdataTranslation(value as Masterdata | LegacyMasterdata) ??
            placeholder
          }
        />
        <div
          className={classNames(
            'text-gray-500',
            classNameIcon ?? 'right-4 top-3'
          )}
        >
          <FontAwesomeIcon size="xs" icon={faChevronDown} />
        </div>
      </div>
      {isShow && (
        <ul
          className={classNames(
            'absolute top-full mt-2 left-0 z-10 max-h-44 overflow-auto',
            'bg-white border shadow-md min-w-full rounded'
          )}
          ref={dropdownRef}
        >
          {options.map((item) => (
            <li
              aria-hidden
              className={classNames(
                'w-full px-3 py-2 text-left transition cursor-pointer whitespace-nowrap',
                'hover:bg-gray-200',
                item.key === null && 'text-neutral opacity-40'
              )}
              key={item.key}
              onClick={() => onSelect(item)}
            >
              {renderer && renderer(item)}
            </li>
          ))}
        </ul>
      )}
    </button>
  )
}
