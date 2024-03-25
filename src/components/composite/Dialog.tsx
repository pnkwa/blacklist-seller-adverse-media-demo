import React, { ReactElement } from 'react'
import classNames from 'classnames'
import { ConfirmCancelButton } from './ConfirmCancelButton'

interface ConfirmDialogProps {
  children?: React.ReactNode
  title?: React.ReactNode
  message?: React.ReactNode
  messageClass?: string
  titleClass?: string
  titleIconImg?: ReactElement
  onConfirm?: (e: React.MouseEvent<HTMLElement>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
  confirmButtonLabel?: string
  isConfirmButtonDisabled?: boolean
  isConfirmButtonLoading?: boolean
  cancelButtonLabel?: string
  className?: string
  childClass?: string
  btnWrapperClass?: string
  confirmBtnClass?: string
  cancelBtnClass?: string
}

export const Dialog: React.FC<ConfirmDialogProps> = ({
  children,
  message,
  messageClass,
  title,
  titleClass,
  titleIconImg,
  onConfirm,
  onCancel,
  confirmButtonLabel,
  isConfirmButtonDisabled,
  cancelButtonLabel,
  className,
  childClass,
  btnWrapperClass,
  confirmBtnClass,
  cancelBtnClass,
  isConfirmButtonLoading,
}) => (
  <div
    className={classNames(
      'flex-col flex shadow',
      'm-auto mx-2',
      'rounded-2xl bg-base-100',
      className
    )}
  >
    <div className="pt-6 px-6 space-y-2">
      {title && (
        <div
          className={classNames(
            'flex items-center justify-between text-lg font-bold',
            titleClass
          )}
        >
          {title}
          {titleIconImg && <div className="cursor-pointer">{titleIconImg}</div>}
        </div>
      )}
      {message && (
        <div className={classNames('whitespace-pre-wrap', messageClass)}>
          {message}
        </div>
      )}
    </div>
    {children && (
      <div className={classNames('p-6 flex-1 flex flex-col', childClass)}>
        {children}
      </div>
    )}
    <ConfirmCancelButton
      className={classNames('px-6 pb-6', btnWrapperClass)}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmButtonLabel={confirmButtonLabel}
      cancelButtonLabel={cancelButtonLabel}
      confirmButtonClassName={confirmBtnClass}
      cancelButtonClassName={cancelBtnClass}
      isConfirmButtonDisabled={isConfirmButtonDisabled}
      isConfirmButtonLoading={isConfirmButtonLoading}
    />
  </div>
)
