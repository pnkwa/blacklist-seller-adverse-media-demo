import classNames from 'classnames'
import { FC } from 'react'

interface TableFieldProps {
  label?: string
}

export const PositionTableField: FC<TableFieldProps> = ({ label }) => (
  <p
    className={classNames(
      'neutral',
      'text-left w-24 h-2 inline-block rounded-full mr-2'
    )}
    data-bs-toggle="tooltip"
    data-bs-html="true"
  >
    {label}
  </p>
)
