import { FC } from 'react'
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Validate,
} from 'react-hook-form'
import { FormControl } from './FormControl'
import { DateDropdownField } from './DateDropdownField'

interface DateDropdownProps {
  control?: Control<FieldValues, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  fieldKey: string
  error?: FieldError
  validation?: Validate<any, any> | Record<string, Validate<any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
  value?: string
  label?: string
}

export const DateDropdown: FC<DateDropdownProps> = ({
  control,
  fieldKey,
  error,
  validation = {},
  value,
  label = '',
}) => (
  <FormControl error={error} label={label}>
    <Controller
      name={fieldKey}
      control={control}
      rules={{ validate: validation }}
      render={({ field }) => (
        <DateDropdownField
          onChange={field.onChange}
          control={control}
          value={value}
        />
      )}
    />
  </FormControl>
)
