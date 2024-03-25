import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import SendIcon from 'assets/svg/icon-send.svg?react'
import { Flow } from 'types/caseKeeperCore'
import { Spinner } from 'components/base'
import { useModal } from 'hooks/useModal'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { sortByKey } from 'utils/common'
import { delay } from 'utils/timeout'
import { NotifyType } from 'types/kycCore'
import { getDisplayedBackgroundCheckStatus } from 'utils/backgroundCheck'
import { BackgroundCheckStatus } from 'types/bgcCore'
import { ResendModal } from '../Modal/ResendLink'

enum Step {
  READY,
  SENDING,
  SENT,
}

export const ResendLinkButton = ({
  flow,
  onConfirm,
  classNameBtn,
}: {
  flow: Flow
  onConfirm?: () => void
  classNameBtn?: string
}) => {
  const { t } = useTranslation()
  const modal = useModal()
  const { fetchEvents, sendNotification } = useCaseKeeperContext()
  const [step, setStep] = useState(Step.READY)

  const onSubmit = useCallback(
    async (data) => {
      modal.destroy()
      const { phoneNo, email, notifyType } = data ?? {}
      setStep(Step.SENDING)
      await sendNotification(flow.id, {
        notifyType,
        email: notifyType === NotifyType.EMAIL && email,
        phoneNumber: notifyType === NotifyType.SMS && phoneNo,
      })
      setStep(Step.SENT)
      if (onConfirm) onConfirm()
      await delay(2000)
      await setStep(Step.READY)
    },
    [flow.id, modal, onConfirm, sendNotification]
  )

  const onClick = useCallback(
    async (e) => {
      e.stopPropagation()
      const events = await fetchEvents({
        'key-$in': 'flow.created,flow.notification.sent',
        dataId: flow.id,
      })

      modal.renderElement(
        <ResendModal
          flow={flow}
          events={events.data?.sort(sortByKey('createdAt'))}
          onCancel={() => modal.destroy()}
          onSubmit={onSubmit}
        />
      )
    },
    [fetchEvents, flow, modal, onSubmit]
  )

  const isHideResendButton = useMemo(() => {
    const status = getDisplayedBackgroundCheckStatus(flow.backgroundCheck)
    const isExpired = status === BackgroundCheckStatus.EXPIRED
    const isInProgress =
      status === BackgroundCheckStatus.OPEN ||
      status === BackgroundCheckStatus.PENDING_CLIENT

    return !isInProgress || isExpired
  }, [flow.backgroundCheck])

  switch (step) {
    case Step.SENDING:
      return (
        <div className="text-neutral">
          <Spinner className="loading-xs mr-1" />
          <span>{t('resendLink.sending')}</span>
        </div>
      )
    case Step.SENT:
      return (
        <div className="text-success">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          <span>{t('resendLink.sent')}</span>
        </div>
      )
    case Step.READY:
    default:
      return (
        <button
          type="submit"
          onClick={onClick}
          className={classNames(
            'btn btn-sm btn-ghost shadow whitespace-nowrap font-normal',
            isHideResendButton && 'hidden',
            classNameBtn
          )}
        >
          <SendIcon />
          <span>{t('resendLink.button')}</span>
        </button>
      )
  }
}
