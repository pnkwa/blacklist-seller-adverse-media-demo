import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { ConfirmCancelButton } from '../ConfirmCancelButton'

interface SettingsLayoutProps {
  title: string
  subTitle?: string
  contentWrapperClass?: string
  onConfirm: () => unknown
  onCancel: () => unknown
  confirmLoading?: boolean
  children?: React.ReactNode
  isConfirmButtonDisabled?: boolean
  hideButtons?: boolean
}

export const SettingsLayout: FC<SettingsLayoutProps> = ({
  title,
  subTitle,
  contentWrapperClass,
  onConfirm,
  onCancel,
  children,
  confirmLoading,
  isConfirmButtonDisabled,
  hideButtons,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={classNames(
        'flex-1 flex flex-col overflow-hidden text-xs sm:text-sm',
        'text-base-content'
      )}
    >
      <div className="flex-1 flex flex-col overflow-auto pt-6 px-2">
        <p className="font-bold text-lg sm:text-xl">{title}</p>
        {subTitle && (
          <p className="text-sm sm:text-md text-neutral-400">{subTitle}</p>
        )}
        <div className={classNames('flex-1 py-6', contentWrapperClass)}>
          {children}
        </div>
      </div>
      {!hideButtons && (
        <div className="flex justify-end py-4">
          <ConfirmCancelButton
            confirmButtonClassName="w-20"
            cancelButtonClassName="w-20"
            confirmLoading={confirmLoading}
            onConfirm={onConfirm}
            isConfirmButtonDisabled={isConfirmButtonDisabled}
            onCancel={onCancel}
            confirmButtonLabel={t('generic.save')}
          />
        </div>
      )}
    </div>
  )
}
