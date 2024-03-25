import classNames from 'classnames'
import { ProcessCriteria } from 'types/bgcCore'
import { FormControl, FormControlProps } from 'components/form/FormControl'

interface CheckboxFieldProps {
  children?: React.ReactNode
  id: string
  checked: boolean
  onCheck: (value: boolean) => unknown
  label: string
  className?: string
  withBoxClass?: boolean
}

/** will have gray bg in mobile screen */
export const boxClass = 'bg-base-200 p-4 sm:p-0 rounded-box sm:bg-transparent'

export const CriteriaTopic: React.FC<CheckboxFieldProps> = ({
  children,
  id,
  checked,
  onCheck,
  label,
  className,
  withBoxClass = true,
}) => {
  return (
    <div
      className={classNames(
        'w-full block mb-6 sm:mb-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-8 justify-between',
        className
      )}
    >
      <div
        className={classNames(
          'flex-1 w-full sm:w-auto flex items-center space-x-2',
          'sm:h-10'
        )}
      >
        <input
          type="checkbox"
          id={id}
          name={id}
          className="checkbox checkbox-sm inline-block align-middle"
          checked={checked}
          onChange={(e) => {
            const { checked } = e.target
            onCheck(checked)
          }}
        />
        <label className="cursor-pointer" htmlFor={id}>
          {label}
        </label>
      </div>
      {checked && children && (
        <div className={classNames(withBoxClass && boxClass)}>{children}</div>
      )}
    </div>
  )
}

export const OverriddenFormControl: React.FC<FormControlProps> = ({
  children,
  fieldWrapperClassName,
  labelClassName,
  ...props
}) => (
  <FormControl
    labelClassName={classNames('min-w-max', labelClassName)}
    fieldWrapperClassName={classNames(
      'sm:flex items-center sm:space-x-4 sm:space-y-0',
      fieldWrapperClassName
    )}
    {...props}
  >
    {children}
  </FormControl>
)

export interface ProcessCriteriaFormProps {
  onChange?: (value: ProcessCriteria) => unknown
  criteria?: ProcessCriteria
}
