import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ConfirmCancelButton } from '../ConfirmCancelButton'

interface ActionBarProps {
  length: number
  title: string
  onDownloadZip?: () => void
  onCancel?: () => void
}

export const ActionBar = ({
  length,
  title,
  onDownloadZip,
  onCancel,
}: ActionBarProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={classNames(
        'sm:absolute fixed bg-base-100 p-2 left-[50%] sm:h-fit h-20 w-full px-8 rounded pb-0',
        '-translate-x-1/2 bottom-0'
      )}
    >
      <div className="flex flex-row items-center justify-between ">
        <ConfirmCancelButton
          onCancel={onCancel}
          cancelButtonClassName="w-28 lg:btn-md btn-sm"
        />
        {title && (
          <p className="font-extrabold text-base text-center px-4 lg:text-md text-sm">
            {t(title, {
              count: length,
            })}
          </p>
        )}
        <ConfirmCancelButton
          onConfirm={onDownloadZip}
          confirmButtonLabel={t('generic.download')}
          confirmButtonClassName="w-28 lg:btn-md btn-sm "
        />
      </div>
    </div>
  )
}
