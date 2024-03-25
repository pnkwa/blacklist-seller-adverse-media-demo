import React from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { UseFormRegisterReturn, FieldError } from 'react-hook-form'
import { FormControl } from './FormControl'

interface RadioProps extends React.ComponentPropsWithoutRef<'input'> {
  className?: string
  formControlClassName?: string
  optionClassName?: string
  error?: FieldError
  label?: string
  options?: string[]
  fieldKey?: string
  register?: UseFormRegisterReturn
  value?: string
  disabled?: boolean
  translatePrefix?: string
}

export const Radio: React.FC<RadioProps> = ({
  className,
  formControlClassName,
  optionClassName,
  error,
  label,
  options = [],
  value,
  fieldKey,
  register,
  disabled,
  translatePrefix,
  onChange,
}) => {
  const { t } = useTranslation()

  return (
    <FormControl label={label} error={error} className={formControlClassName}>
      <div className="flex space-x-4">
        {options.map((item) => (
          <div key={`${fieldKey}.${item}`} className={optionClassName}>
            <input
              id={`${fieldKey}.${item}`}
              type="radio"
              value={item}
              className={classnames(
                'radio radio-xs radio-primary inline-block align-middle',
                className
              )}
              disabled={disabled}
              checked={item === value}
              onChange={onChange}
              {...register}
            />
            <label
              htmlFor={`${fieldKey}.${item}`}
              className={classnames(
                'capitalize text-xs xs+:text-base inline-block cursor-pointer',
                'align-middle ml-1 text-base-content'
              )}
            >
              {translatePrefix ? t(`${translatePrefix}.${item}`) : item}
            </label>
          </div>
        ))}
      </div>
    </FormControl>
  )
}
