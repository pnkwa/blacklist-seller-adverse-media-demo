import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import IconCaseWarning from 'assets/svg/icon-case-warning.svg?react'
import { Modal } from '../Modal'

interface WarningConfirmModalProps {
  title: string
  subTitle?: string
  confirmButtonLabel?: string
  cancelButtonLabel?: string
  modalClass?: string
  onCancel: () => void
  onConfirm: () => void
}

export const WarningConfirmModal: FC<WarningConfirmModalProps> = ({
  title,
  subTitle,
  confirmButtonLabel,
  cancelButtonLabel,
  modalClass,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      modalClass={classNames('!max-w-[18rem] w-full', modalClass)}
      onCancel={onCancel}
      onConfirm={onConfirm}
      confirmButtonLabel={confirmButtonLabel ?? t('generic.confirm')}
      confirmButtonClassName="text-xs font-normal"
      cancelButtonLabel={cancelButtonLabel ?? t('generic.cancel')}
      cancelButtonClassName="text-xs font-normal"
      buttonClassName="!pt-6"
    >
      <div className="flex flex-col justify-center items-center space-y-2 text-center">
        <IconCaseWarning />
        <p className="font-bold text-md">{title}</p>
        {subTitle && <p className="text-sm text-center">{subTitle}</p>}
      </div>
    </Modal>
  )
}
