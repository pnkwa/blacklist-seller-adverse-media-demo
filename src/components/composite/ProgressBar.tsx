import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import ErrorIcon from 'assets/svg/status/error.svg?react'
import SuccessIcon from 'assets/svg/status/success.svg?react'
import PaperIcon from 'assets/svg/icon-paper.svg?react'
import { dateFormats } from 'config/dateFormats'
import { BackgroundCheck } from 'types/bgcCore'
import {
  filterProcesses,
  getBatchStatus,
  getStatusBatchColor,
} from 'utils/caseKeeperCore/processesConfig'
import { BatchStatus } from 'config/processes'
import { dateFormat } from 'utils/date'

interface ProgressBarProps {
  onClick?: (process: string) => void
  backgroundCheck?: BackgroundCheck
  className?: string
}

const getIcons = (s: BatchStatus, SVGIcon) => {
  switch (s) {
    case BatchStatus.VERIFIED:
    case BatchStatus.CHECKED:
    case BatchStatus.APPROVED:
      return <SuccessIcon className="!text-white" />
    case BatchStatus.REJECTED:
    case BatchStatus.NOT_VERIFIED:
    case BatchStatus.NEED_REVIEW:
      return <ErrorIcon className="!text-white" />
    case BatchStatus.IN_PROGRESS:
    default:
      return <SVGIcon />
  }
}

const ProgressBar = ({
  onClick,
  backgroundCheck,
  className,
}: ProgressBarProps) => {
  const { t } = useTranslation()

  const processesResult = useMemo(() => {
    if (!backgroundCheck?.processConfigs) return []
    return filterProcesses(backgroundCheck.processConfigs, ['kyc']).map(
      ({ key, ...rest }) => {
        const isKyc = key === 'kyc'
        const iconStatus = getBatchStatus(backgroundCheck, key)
        const date = isKyc
          ? backgroundCheck.approvedAt ??
            backgroundCheck?.verificationInfo?.kycCompletedAt
          : backgroundCheck?.[key]?.updatedAt
        const subTitle = isKyc && backgroundCheck.approvalRemark?.from
        return {
          ...rest,
          key,
          subTitle,
          iconStatus,
          date,
        }
      }
    )
    // TODO: sorting
    // .sort(sortByKey('date', 'desc'))
  }, [backgroundCheck])

  return (
    <ul
      className={classnames(
        'timeline timeline-compact timeline-vertical p-4 relative space-y-2',
        className
      )}
    >
      {processesResult.map(
        (
          { key, iconClassName, iconStatus, SVGIcon, subTitle, title, date },
          i
        ) => (
          <li key={key} className="flex items-start">
            <div className="timeline-middle flex flex-col items-center">
              <div
                className={classnames(
                  'avatar rounded-full w-8 h-8 flex justify-center items-center text-white',
                  `bg-${getStatusBatchColor(iconStatus)}`,
                  iconClassName
                )}
              >
                {iconStatus && getIcons(iconStatus, SVGIcon)}
              </div>
              {processesResult.length > i + 1 && (
                <hr
                  style={{
                    height: '40px',
                    width: '2px',
                    marginTop: '0.5rem',
                  }}
                />
              )}
            </div>
            <div className="pl-3 flex h-full w-full space-x-4">
              <div className="flex-1 flex flex-col pt-2">
                <p className="text-sm text-start font-bold">{t(title)}</p>
                {subTitle && (
                  <p className="text-xs text-start text-neutral">
                    {t(subTitle)}
                  </p>
                )}
                {date && (
                  <p className="text-sm text-start text-neutral">
                    {dateFormat(date, dateFormats.dayMonthYearDateTime)}
                  </p>
                )}
              </div>
              {onClick && (
                <button
                  type="button"
                  onClick={() => onClick(key)}
                  className={classnames(
                    'btn btn-sm font-normal btn-outline h-8',
                    'rounded-full opacity-70 border-neutral/60'
                  )}
                >
                  <PaperIcon />
                  {t('generic.see')}
                </button>
              )}
            </div>
          </li>
        )
      )}
    </ul>
  )
}

export default ProgressBar
