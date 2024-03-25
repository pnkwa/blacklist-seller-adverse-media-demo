import { faInfo, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useModal } from 'hooks/useModal'
import { Flow } from 'types/caseKeeperCore'
import { getRequiredProcesses } from 'utils/backgroundCheck'
import { getPercentage } from 'utils/number'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import { routes } from 'config/routes'
import { Modal } from '../Modal'
import ProgressBar from '../ProgressBar'
import { FlowAvatarImage } from '../FlowAvatarImage'

interface ResultProgressProps {
  flow: Flow
  displayInfo?: boolean
}

export const ResultProgress = ({
  flow,
  displayInfo = true,
}: ResultProgressProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const modal = useModal()

  const { backgroundCheck } = flow

  const processes = useMemo(
    () => getRequiredProcesses(backgroundCheck),
    [backgroundCheck]
  )

  const total = useMemo(() => processes.length, [processes.length])

  const progress = useMemo(
    () => processes.filter((p) => backgroundCheck?.[p]?.completed).length,
    [backgroundCheck, processes]
  )

  const onClick = useCallback(
    (e) => {
      e.stopPropagation()

      const navigateDetails = (anchor?: string) => {
        modal.destroy()
        navigate(`${routes.caseDetail.replace(':id', flow.id)}#${anchor}`)
      }

      modal.renderElement(
        <Modal
          onConfirm={() => navigateDetails()}
          confirmButtonLabel={t('generic.seeDetails')}
          modalClass="h-full max-h-[650px] flex flex-col relative"
        >
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => modal.destroy()}
            className="absolute right-6 top-8 text-xl cursor-pointer z-[1]"
          />
          <div className="space-y-4 relative">
            <div className="font-bold">{t('resultProgress.popupTitle')}</div>
            <div className="flex space-x-2 items-center text-sm">
              <FlowAvatarImage flow={flow} className="w-8" />
              <span>
                {getVerificationInfoFullName(
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  flow.backgroundCheck!.verificationInfo!
                )}
              </span>
            </div>
            <div className="border-b" />
          </div>
          <div className="flex-1 overflow-y-auto pt-4">
            <ProgressBar
              backgroundCheck={flow.backgroundCheck}
              className="!p-0"
              onClick={(process) => navigateDetails(process)}
            />
          </div>
        </Modal>
      )
    },
    [flow, modal, navigate, t]
  )

  if (!processes.length) return '-'
  return (
    <div className="space-y-2">
      <div className="h-2 w-36 rounded bg-base-300 relative">
        <div
          className="absolute z-[1] inset-y-0 left-0 rounded bg-success"
          style={{ width: `${getPercentage(progress, total).toFixed(3)}%` }}
        />
      </div>
      <div className="text-neutral">
        <span className="mr-1">
          {progress
            ? t(`resultProgress.progressLabel`, { progress, total })
            : t(`resultProgress.noProgress`)}
        </span>
        {displayInfo && (
          <button type="button" aria-label="progress" onClick={onClick}>
            <FontAwesomeIcon
              icon={faInfo}
              className="p-0.5 rounded-full border w-2 h-2 text-neutral border-neutral"
            />
          </button>
        )}
      </div>
    </div>
  )
}
