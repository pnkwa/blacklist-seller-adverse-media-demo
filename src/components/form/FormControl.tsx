import React from 'react'
import classnames from 'classnames'
import { FieldError } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export interface FormControlProps {
  key?: string | null
  label?: string
  labelClassName?: string
  fieldWrapperClassName?: string
  error?: FieldError
  children?: React.ReactNode
  className?: string
  hidden?: boolean
  tip?: string
  col?: string
}

export const FormControl: React.FC<FormControlProps> = ({
  key,
  label,
  labelClassName,
  fieldWrapperClassName,
  error,
  children,
  className,
  hidden,
  tip,
  col,
}) => {
  return (
    <div
      className={classnames(
        hidden && 'hidden',
        col ? `col-span-${col}` : 'col-span-12',
        className
      )}
      key={key}
    >
      <div className={classnames(label && 'space-y-1', fieldWrapperClassName)}>
        {label && (
          <div className="min-w-24 xs+:min-w-40">
            <div className="inline-block label p-0 mr-1">
              <p
                className={classnames(
                  'label-text text-xs xs+:text-sm',
                  labelClassName
                )}
              >
                {label}
              </p>
            </div>
            {tip && (
              <div
                className="inline-block tooltip tooltip-right relative z-40"
                data-tip={tip}
              >
                <FontAwesomeIcon icon={faQuestionCircle} size="xs" />
              </div>
            )}
          </div>
        )}
        <div className="w-full">{children}</div>
      </div>
      {error && (
        <div className="py-1 pb-0 block text-right text-xs">
          <span className="label-text-alt text-error whitespace-pre-wrap">
            {error.message ?? error.type}
          </span>
        </div>
      )}
    </div>
  )
}
