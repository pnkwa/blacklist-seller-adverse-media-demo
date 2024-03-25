import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { FC } from 'react'
import PassedIcon from 'assets/svg/passed-icon.svg?react'
import FailedIcon from 'assets/svg/failed-icon.svg?react'
import { ConfirmCancelButton } from './ConfirmCancelButton'
import { Modal } from './Modal'

interface BulkDownloadPopupProps {
  success?: boolean
  onConfirm?: () => void
}
export const BulkDownloadPopup: FC<BulkDownloadPopupProps> = ({
  success = false,
  onConfirm,
}) => {
  const { t } = useTranslation()

  return (
    <Modal>
      <div
        className={classNames(
          'flex-col flex justify-center items-center m-auto mx-2',
          'max-w-lg text-center '
        )}
      >
        <div className="space-y-2 items-center flex flex-col justify-center">
          <div className="flex justify-center items-center">
            {success ? <PassedIcon /> : <FailedIcon />}
          </div>
          <div className="flex items-center justify-center text-lg font-bold">
            {success
              ? t('bulkDownloadNotice.title')
              : t('bulkDownloadNotice.error.title')}
          </div>
          <div className="flex items-center justify-center font-normal m-6">
            {success
              ? t('bulkDownloadNotice.description')
              : t('bulkDownloadNotice.error.detail')}
          </div>
          <ConfirmCancelButton
            className="px-6 pb-6 w-fit"
            onConfirm={onConfirm}
          />
        </div>
      </div>
    </Modal>
  )
}
