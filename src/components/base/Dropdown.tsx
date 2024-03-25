import classNames from 'classnames'
import Select, {
  ClassNamesConfig,
  GroupBase,
  OptionsOrGroups,
  SelectComponentsConfig,
} from 'react-select'

export const defaultDropdownClassNames = {
  control: ({ isFocused }) =>
    classNames(
      '!cursor-pointer !rounded-lg !py-0',
      isFocused &&
        '!border-base-content/25 !ring-2 !ring-offset-2 !ring-base-content/25 !shadow-none'
    ),
  option: ({ isSelected, isFocused }) =>
    classNames(
      '!cursor-pointer',
      (isSelected || isFocused) && '!bg-primary/5 !text-primary'
    ),
  menu: () => '!rounded-lg',
  dropdownIndicator: ({ isFocused }) => classNames(isFocused && 'rotate-180'),
}

const defaultComponents = {
  IndicatorSeparator: () => null,
}

interface InputSelectValue {
  label: string | any // eslint-disable-line @typescript-eslint/no-explicit-any
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface DropdownProps {
  className?: string
  classNames?: ClassNamesConfig<any, false, GroupBase<any>> // eslint-disable-line @typescript-eslint/no-explicit-any
  components?: SelectComponentsConfig<any, false, GroupBase<any>> // eslint-disable-line @typescript-eslint/no-explicit-any
  isSearchable?: boolean
  menuPosition?: 'absolute' | 'fixed'
  options: OptionsOrGroups<any, GroupBase<any>> // eslint-disable-line @typescript-eslint/no-explicit-any
  value?: InputSelectValue | null
  placeholder?: string
  onChange?: (value) => void
  getOptionLabel?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  getOptionValue?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  classNames = defaultDropdownClassNames,
  components = defaultComponents,
  isSearchable = false,
  menuPosition,
  options,
  value,
  placeholder,
  onChange,
  getOptionLabel,
  getOptionValue,
}) => (
  <Select
    placeholder={placeholder}
    className={className}
    classNames={classNames}
    components={components}
    menuPosition={menuPosition}
    isSearchable={isSearchable}
    value={value}
    options={options}
    onChange={onChange}
    getOptionLabel={getOptionLabel}
    getOptionValue={getOptionValue}
  />
)
