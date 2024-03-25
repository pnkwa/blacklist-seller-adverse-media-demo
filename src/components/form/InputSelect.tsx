import { FC } from 'react'
import classnames from 'classnames'
import Select, { GroupBase, OptionsOrGroups } from 'react-select'
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Validate,
} from 'react-hook-form'
import { FormControl } from './FormControl'

const height = '2rem'

const customDropDownStylesBuilder = {
  indicatorsContainer: (provided) => ({
    ...provided,
    minHeight: height,
    maxHeight: height,
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: height,
    maxHeight: height,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  control: (provided) => ({
    ...provided,
    minHeight: height,
    maxHeight: height,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 12,
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: 12,
  }),
  multiValue: (provided) => ({
    ...provided,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 12,
  }),
  input: (provided) => ({
    ...provided,
    minHeight: height,
    maxHeight: height,
    margin: 0,
    padding: 0,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 50,
  }),
}

interface InputSelectValue {
  label: string | any // eslint-disable-line @typescript-eslint/no-explicit-any
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface InputSelectProps {
  className?: string
  col?: string
  control?: Control<FieldValues, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  defaultValue?: string | InputSelectValue
  disabled?: boolean
  error?: FieldError
  isMulti?: boolean
  label?: string
  labelClassName?: string
  name: string
  onChange?: (value) => void
  options?: OptionsOrGroups<any, GroupBase<any>> // eslint-disable-line @typescript-eslint/no-explicit-any
  placeholder?: string
  required?: boolean
  tip?: string
  validation?: Validate<any, any> | Record<string, Validate<any, any>> // eslint-disable-line @typescript-eslint/no-explicit-any
  value?: InputSelectValue | InputSelectValue[] | null
}

export const InputSelect: FC<InputSelectProps> = ({
  className,
  col,
  control,
  defaultValue,
  disabled,
  error,
  isMulti,
  label = '',
  labelClassName,
  name,
  onChange,
  options = [],
  placeholder,
  tip,
  validation,
  value,
}) => (
  <FormControl
    className={className}
    col={col}
    error={error}
    label={label}
    labelClassName={labelClassName}
    tip={tip}
  >
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ validate: validation }}
      render={({ field }) => (
        <Select
          {...field}
          className={classnames(error && 'reselect_error')}
          classNamePrefix="reselect"
          closeMenuOnSelect={!isMulti}
          isDisabled={disabled}
          isMulti={isMulti}
          menuPortalTarget={document.body}
          onChange={onChange ?? field.onChange}
          options={options}
          placeholder={placeholder}
          classNames={{
            control: ({ isFocused }) =>
              classnames(
                '!cursor-pointer !rounded-lg',
                isFocused &&
                  '!border-base-content/25 !ring-2 !ring-offset-2 !ring-base-content/25 !shadow-none',
                error && '!border-error !ring-primary'
              ),
            option: ({ isSelected, isFocused }) =>
              classnames(
                '!cursor-pointer',
                (isSelected || isFocused) && '!bg-primary/5 !text-primary'
              ),
            placeholder: () => '!text-xs !text-base-content/50',
            menu: () => '!rounded-lg',
          }}
          styles={{
            ...customDropDownStylesBuilder,
          }}
          value={value === undefined ? field.value : value}
          components={{
            IndicatorSeparator: () => null,
          }}
        />
      )}
    />
  </FormControl>
)
