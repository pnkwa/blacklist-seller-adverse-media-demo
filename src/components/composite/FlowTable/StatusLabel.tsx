import classNames from 'classnames'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BackgroundApprovalStatus, BackgroundCheckStatus } from 'types/bgcCore'
import { Flow } from 'types/caseKeeperCore'
import { getDisplayedBackgroundCheckStatus } from 'utils/backgroundCheck'

const getStatusColor = (
  status: BackgroundCheckStatus | BackgroundApprovalStatus
) => {
  switch (status) {
    case BackgroundCheckStatus.BLOCKED:
    case BackgroundApprovalStatus.APPROVED:
    case BackgroundApprovalStatus.REJECTED:
      return 'warning'
    case BackgroundCheckStatus.PENDING_OPERATION:
      return 'info'
    case BackgroundCheckStatus.COMPLETED:
    case BackgroundCheckStatus.VERIFIED:
      return 'success'
    case BackgroundCheckStatus.EXPIRED:
      return 'error'
    case BackgroundCheckStatus.OPEN:
    case BackgroundCheckStatus.PENDING_CLIENT:
    default:
      return 'neutral'
  }
}

interface StatusLabelProps {
  flow: Flow
}

export const StatusLabel = ({ flow }: StatusLabelProps) => {
  const { t } = useTranslation()

  const displayedStatus = useMemo(
    () => getDisplayedBackgroundCheckStatus(flow.backgroundCheck),
    [flow.backgroundCheck]
  )

  if (!displayedStatus) return null

  const color = getStatusColor(displayedStatus)

  return (
    <span
      className={classNames(
        'tag-label whitespace-nowrap',
        `text-${color} bg-${color} bg-opacity-20`
      )}
    >
      {t(`flowTable.status.${displayedStatus}`, {
        defaultValue: displayedStatus,
      })}
    </span>
  )
}
