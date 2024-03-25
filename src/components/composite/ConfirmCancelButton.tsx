import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner } from 'components/base'

export interface ConfirmCancelButtonProps {
  className?: string
  confirmButtonLabel?: string
  confirmButtonClassName?: string
  cancelButtonLabel?: string
  cancelButtonClassName?: string
  isConfirmButtonDisabled?: boolean
  isConfirmButtonLoading?: boolean
  onConfirm?: (e: React.MouseEvent<HTMLElement>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
  confirmLoading?: boolean
}

export const ConfirmCancelButton: React.FC<ConfirmCancelButtonProps> = ({
  className,
  confirmButtonLabel,
  confirmButtonClassName,
  cancelButtonLabel,
  cancelButtonClassName,
  isConfirmButtonDisabled,
  isConfirmButtonLoading,
  onConfirm,
  onCancel,
  confirmLoading,
}) => {
  const { t } = useTranslation()

  if (!onConfirm && !onCancel) return null

  return (
    <div className={classNames('flex flex-row space-x-4', className)}>
      {onCancel && (
        <button
          id="cancel-button"
          type="button"
          className={classNames(
            'flex-1 btn btn-outline border-base-300',
            'text-sm font-normal !shadow',
            cancelButtonClassName
          )}
          onClick={onCancel}
        >
          {cancelButtonLabel ?? t('generic.cancel')}
        </button>
      )}
      {onConfirm && (
        <button
          id="ok-button"
          type="submit"
          className={classNames(
            'btn btn-primary text-sm font-normal flex-1',
            confirmButtonClassName,
            isConfirmButtonLoading && 'loading btn-disabled',
            confirmLoading && 'btn-disabled'
          )}
          onClick={onConfirm}
          disabled={isConfirmButtonDisabled}
        >
          {!confirmLoading ? (
            confirmButtonLabel ?? t('generic.confirm')
          ) : (
            <Spinner />
          )}
        </button>
      )}
    </div>
  )
}
