import classNames from 'classnames'
import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import ClipboardIcon from 'assets/svg/icon-clipboard.svg?react'
import { MessageType } from 'components/base/Message'
import { useMessage } from 'hooks/message'
import { Event, Flow } from 'types/caseKeeperCore'
import { MOBILE_PHONE_VALIDATION, EMAIL } from 'utils/regex'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import { env } from 'config/env'
import { NotifyType } from 'types/kycCore'
import { selectContactByType } from 'utils/flow'
import { copyToClipboard } from 'utils/clipboard'
import { FlowAvatarImage } from '../FlowAvatarImage'
import { Modal } from '../Modal'

interface ResendModalProps {
  flow: Flow
  events: Event[]
  onCancel: () => void
  onSubmit: (data) => void
}

export const ResendModal: FC<ResendModalProps> = ({
  flow,
  events,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation()
  const message = useMessage()
  const [notifyType, setNotifyType] = useState(
    () => flow.verification?.notifyType ?? flow.proprietor?.notifyType
  )

  const [email, setEmail] = useState(() =>
    selectContactByType(NotifyType.EMAIL)(flow.verification, flow.proprietor)
  )
  const [phoneNo, setPhoneNo] = useState(() =>
    selectContactByType(NotifyType.SMS)(flow.verification, flow.proprietor)
  )

  const { id, backgroundCheck } = flow ?? {}
  const { verificationInfo } = backgroundCheck ?? {}

  const flowUrl = `${window.origin}${env.FLOW_BASE_PATH}/${id}`

  const lastSent = useMemo(
    () => (events.length ? moment(events?.[0]?.createdAt).fromNow() : ' - '),
    [events]
  )

  const error = useMemo(() => {
    if (notifyType === NotifyType.SMS)
      return (
        !MOBILE_PHONE_VALIDATION.test(phoneNo ?? '') && t('validation.phone')
      )
    return !EMAIL.test(email ?? '') && t('validation.email')
  }, [email, phoneNo, notifyType, t])

  const copyText = useCallback(
    async (text) => {
      if (!text) return
      try {
        await copyToClipboard(text)
        message.render({
          type: MessageType.Success,
          text: t('resendLink.copied'),
        })
      } catch (e) {
        message.render({
          type: MessageType.Error,
          text: (e as { message: string }).message,
        })
      }
    },
    [message, t]
  )

  const handleRadioChange = (event) => setNotifyType(event.target.value)

  const handleInputChange = (event) =>
    notifyType === NotifyType.SMS
      ? setPhoneNo(event.target.value)
      : setEmail(event.target.value)

  return (
    <Modal
      onCancel={onCancel}
      onConfirm={() => onSubmit({ phoneNo, email, notifyType })}
      isConfirmButtonDisabled={!!error}
    >
      <div className="h-full w-96 text-center">
        <div className="space-y-2 mb-2">
          <div className="mb-3">
            <div className="font-bold mb-1">{t('resendLink.confirmTitle')}</div>
            <div className="text-center">
              <span className="text-2xs bg-gray-100 py-1 px-2 rounded-xl">
                {t('resendLink.lastSent', { date: lastSent })}
              </span>
            </div>
          </div>
          <FlowAvatarImage flow={flow} className="!w-12" />
          <div className="text-sm">
            {verificationInfo && getVerificationInfoFullName(verificationInfo)}
          </div>
        </div>
        <p className="text-sm text-start mb-1">{t('resendLink.link')}</p>
        <div className="flex items-center mb-8 space-x-2">
          <input
            type="text"
            className="w-full border py-2 pl-3 rounded-md flex-1"
            value={flowUrl}
            disabled
          />
          <button
            type="button"
            className={classNames(
              'btn btn-ghost btn-sm w-10 h-10 text-gray-500 px-2',
              'rounded-xl hover:bg-gray-300'
            )}
            onClick={() => copyText(flowUrl)}
            aria-label="copy"
          >
            <ClipboardIcon />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-start mb-1 font-bold">
            {t('resendLink.formTitle')}
          </p>
          {[NotifyType.SMS, NotifyType.EMAIL].map((key) => (
            <div className="text-start text-sm" key={key}>
              <label
                className="cursor-pointer flex items-center space-x-2 mb-1"
                htmlFor={key}
              >
                <input
                  type="radio"
                  className="radio radio-primary radio-sm"
                  id={key}
                  name="notifyType"
                  value={key}
                  checked={notifyType === key}
                  onChange={handleRadioChange}
                />
                <label className="label-text" htmlFor={key}>
                  {t(`resendLink.${key}`)}
                </label>
              </label>

              {notifyType === key ? (
                <div>
                  <input
                    className={classNames(
                      `w-full border-[1px] py-2 pl-3 rounded-md flex-1 mt-1`,
                      error && notifyType === key && 'input-error'
                    )}
                    type="text"
                    value={key === NotifyType.SMS ? phoneNo ?? '' : email ?? ''}
                    onChange={handleInputChange}
                  />
                  {error && <p className="text-error text-2xs">{error}</p>}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
