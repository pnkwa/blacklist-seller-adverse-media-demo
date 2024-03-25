import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import i18n from 'i18n'
import { useMessage } from 'hooks/message'
import { Loading } from 'components/base/Loading'
import { MessageType } from 'components/base/Message'
import { Lead } from 'types/tenantConfig'
import DiamondBadgeIcon from 'assets/svg/diamond-badge.svg?react'
import { Modal } from '../Modal'

interface LeadModalProps {
  lead: Lead
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export const LeadModal: FC<LeadModalProps> = ({
  lead,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation()
  const message = useMessage()
  const { language } = i18n

  const {
    alias,
    titleTh,
    titleEn,
    descriptionTh,
    descriptionEn,
    contact,
    imagesTh,
    imagesEn,
  } = lead

  const [loading, setLoading] = useState(false)

  const { title, description, images } = useMemo(
    () =>
      language === 'th'
        ? { title: titleTh, description: descriptionTh, images: imagesTh }
        : { title: titleEn, description: descriptionEn, images: imagesEn },
    [
      descriptionEn,
      descriptionTh,
      imagesEn,
      imagesTh,
      language,
      titleEn,
      titleTh,
    ]
  )

  const handleOnConfirm = useCallback(() => {
    setLoading(true)

    onConfirm()
      .then(() => {
        setLoading(false)
        message.render({
          type: MessageType.Success,
          text: t('lead.message.success'),
          textClassName: 'whitespace-pre-wrap',
          className: '!w-[450px]',
        })
      })
      .catch(() => {
        setLoading(false)
        message.render({
          type: MessageType.Error,
          text: t('lead.message.failed'),
          className: '!w-auto',
        })
      })
  }, [message, onConfirm, t])

  return (
    <Modal modalClass="h-[90vh] !max-w-4xl whitespace-pre-wrap overflow-y-auto text-center">
      <div className="w-full flex flex-row justify-center items-center">
        <div
          className={classNames(
            'text-sm md:text-md lg:text-xl font-bold bg-warning text-primary-content rounded-lg mx-2',
            'p-2'
          )}
        >
          {t('lead.recommend')}
        </div>
        <p className="text-sm sm:text-2xl text-primary">{title}</p>
      </div>
      <div className="text-sm md:text-md lg:text-lg md:px-10 sm:px-20">
        {description}
      </div>
      <div className="flex flex-col items-center m-4">
        {images?.map((url: string, index: number) => (
          <img
            key={`img-${alias}-${index}`}
            alt={alias}
            src={url}
            className="w-auto h-auto min-h-fit max-h-[50vh]"
          />
        ))}
      </div>
      <div className="my-auto">
        <p className="text-sm md:text-md lg:text-md text-gray-500 mb-4">
          {t('lead.contact', { contact })}
        </p>
        <div className="flex flex-row justify-center">
          <button
            type="button"
            className={classNames(
              'w-full max-w-[150px] btn btn-ghost btn-outline text-center mr-4'
            )}
            onClick={onCancel}
          >
            {t('lead.cancelButton')}
          </button>
          <button
            type="button"
            className="w-full max-w-[150px] btn btn-primary text-center disabled:btn-ghost"
            onClick={handleOnConfirm}
            disabled={loading}
          >
            {!loading && (
              <>
                <DiamondBadgeIcon className="h-7" />
                {t('lead.confirmButton')}
              </>
            )}
            {loading && <Loading />}
          </button>
        </div>
      </div>
    </Modal>
  )
}
