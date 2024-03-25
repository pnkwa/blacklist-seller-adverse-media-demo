import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import InputMask from 'react-input-mask'
import CurrencyInputField, {
  CurrencyInputProps,
} from 'react-currency-input-field'
import {
  UseFormRegisterReturn,
  FieldError,
  UseFormSetValue,
} from 'react-hook-form'
import HidePasswordIcon from 'assets/svg/icon-hide-password.svg?react'
import ShowPasswordIcon from 'assets/svg/icon-show-password.svg?react'
import { FormControl } from './FormControl'

export enum InputType {
  TEXT = 'text',
  PASSWORD = 'password',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email',
  CURRENCY = 'currency',
}

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string
  type?: InputType
  className?: string
  col?: string
  formClassName?: string
  labelClassName?: string
  error?: FieldError
  register?: UseFormRegisterReturn
  hidden?: boolean
  mask?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue?: UseFormSetValue<any>
}

export const InputSingle: React.FC<InputProps> = ({
  type = 'text',
  error,
  col,
  className,
  disabled,
  register,
  mask,
  placeholder,
  setValue,
  ...rest
}) => {
  const [inputType, setInputType] = useState(type)

  const onToggleShowPassword = useCallback(() => {
    setInputType((pt) =>
      pt === InputType.PASSWORD ? InputType.TEXT : InputType.PASSWORD
    )
  }, [])

  return (
    <div className="relative">
      {mask && (
        <InputMask
          {...register}
          placeholder={placeholder}
          mask={mask}
          formatChars={{
            x: '[0-9]',
          }}
        >
          {(inputProps) => (
            <input
              className={classnames(
                'input input-bordered text-base-content w-full rounded-lg',
                error && 'input-error',
                className ?? 'input-sm text-xs'
              )}
              {...inputProps}
            />
          )}
        </InputMask>
      )}
      {!mask && type !== InputType.CURRENCY && (
        <input
          type={inputType}
          className={classnames(
            'input input-bordered text-base-content w-full rounded-lg',
            type === InputType.PASSWORD && 'pr-7',
            error && 'input-error',
            className ?? 'input-sm !text-xs'
          )}
          inputMode={type === 'number' ? 'numeric' : 'text'}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          {...rest}
        />
      )}
      {type === InputType.CURRENCY && (
        <CurrencyInputField
          className={classnames(
            'input input-bordered !text-xs text-base-content w-full rounded-lg',
            error && 'input-error',
            className ?? 'input-sm text-xs'
          )}
          decimalsLimit={2}
          allowDecimals
          allowNegativeValue={false}
          placeholder={placeholder}
          disabled={disabled}
          onValueChange={(value, name) => name && setValue?.(name, value)}
          name={register?.name}
          pattern={register?.pattern}
          required={register?.required}
          {...(rest as CurrencyInputProps)}
        />
      )}
      {type === InputType.PASSWORD && (
        <div className="absolute inset-y-0 right-2 flex items-center text-base-content">
          <button
            type="button"
            className="cursor-pointer"
            onClick={onToggleShowPassword}
          >
            {inputType === InputType.PASSWORD ? (
              <ShowPasswordIcon />
            ) : (
              <HidePasswordIcon />
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export const Input: React.FC<InputProps> = ({
  className,
  col,
  label,
  type,
  error,
  register,
  disabled,
  hidden,
  mask,
  formClassName,
  labelClassName,
  ...rest
}) => {
  return (
    <FormControl
      label={label}
      error={error}
      hidden={hidden}
      col={col}
      className={formClassName}
      labelClassName={labelClassName}
    >
      <InputSingle
        type={type}
        error={error}
        className={className}
        disabled={disabled}
        register={register}
        mask={mask}
        {...rest}
      />
    </FormControl>
  )
}
