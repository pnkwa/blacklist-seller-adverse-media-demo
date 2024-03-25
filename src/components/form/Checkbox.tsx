import React from 'react'
import classnames from 'classnames'
import { UseFormRegisterReturn, FieldError } from 'react-hook-form'
import { FormControl } from './FormControl'

interface CheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string
  error?: FieldError
  register?: UseFormRegisterReturn
  className?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  register,
  error,
  className,
  ...rest
}) => (
  <FormControl error={error}>
    <div className="label p-0 cursor-pointer grid grid-cols-2">
      <span className="label-text inline-block">{label}</span>
      <input
        type="checkbox"
        className={classnames(
          'checkbox checkbox-xs rounded-sm inline-block align-middle',
          className
        )}
        {...register}
        {...rest}
      />
    </div>
  </FormControl>
)
