import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import FileIcon from 'assets/svg/icon-file.svg?react'
import WarnIcon from 'assets/svg/icon-warning.svg?react'
import ClockIcon from 'assets/svg/icon-clock.svg?react'
import CheckIcon from 'assets/svg/icon-check.svg?react'
import { getFlowsResultCount, getFlowsResultLoading } from 'reducers'
import { routes } from 'config/routes'
import { Spinner } from 'components/base'
import { getPercentage } from 'utils/number'
import { FlowsResultKey } from 'types/caseKeeperCore'
import { PreviousPeriodDiffLabel } from './PreviousPeriodDiffLabel'

interface BackgroundCountOverviewBoxProps {
  className?: string
}

interface ItemConfig {
  key: FlowsResultKey
  label: string
  icon: React.ReactNode
  iconWrapperClassName?: string
}

const boxes: ItemConfig[] = [
  {
    key: FlowsResultKey.ALL,
    label: 'overviewPage.overviewBox.all',
    icon: <FileIcon />,
    iconWrapperClassName: 'bg-neutral text-neutral',
  },
  {
    key: FlowsResultKey.BLOCKED,
    label: 'overviewPage.overviewBox.blocked',
    icon: <WarnIcon />,
    iconWrapperClassName: 'bg-warning text-warning',
  },
  {
    key: FlowsResultKey.PENDING_OPERATION,
    label: 'overviewPage.overviewBox.pendingOperation',
    icon: <ClockIcon />,
    iconWrapperClassName: 'bg-info text-info',
  },
  {
    key: FlowsResultKey.COMPLETED,
    label: 'overviewPage.overviewBox.received',
    icon: <CheckIcon />,
    iconWrapperClassName: 'bg-success text-success',
  },
]

const Box = ({ item }: { item: ItemConfig }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const count = useSelector(getFlowsResultCount(item.key))
  const loading = useSelector(getFlowsResultLoading(item.key))
  const everyStatusCount = useSelector(getFlowsResultCount(FlowsResultKey.ALL))
  const verifiedCount = useSelector(
    getFlowsResultCount(FlowsResultKey.VERIFIED)
  )

  const resultCount = useMemo(() => {
    if (count === undefined || verifiedCount === undefined) return undefined
    if (item.key === FlowsResultKey.COMPLETED) return count + verifiedCount
    return count
  }, [count, item.key, verifiedCount])

  const showLoading = useMemo(
    () => loading && resultCount === undefined,
    [loading, resultCount]
  )

  const percentage = useMemo(() => {
    if (!everyStatusCount || !resultCount || item.key === FlowsResultKey.ALL)
      return undefined
    return getPercentage(resultCount, everyStatusCount)
  }, [everyStatusCount, resultCount, item.key])

  return (
    <button
      type="button"
      className={classNames(
        'w-full text-left border border-base-200 rounded-box flex-1 p-4 flex items-center space-x-4',
        'hover:border-base-300'
      )}
      onClick={() => {
        const search = new URLSearchParams({
          tab:
            item.key === FlowsResultKey.COMPLETED
              ? FlowsResultKey.RECEIVED
              : item.key,
        })
        navigate(`${routes.backgroundCheck}?${search}`)
      }}
    >
      <div
        className={classNames(
          'w-16 h-16 min-w-0 bg-opacity-10 rounded-box flex items-center justify-center',
          item.iconWrapperClassName
        )}
      >
        {item.icon}
      </div>
      <div className="flex-1">
        <div className="text-xs">{t(item.label)}</div>
        <div className="text-3xl font-bold h-9 mb-1">
          {showLoading ? <Spinner /> : resultCount}
        </div>
        <div className="text-xs min-h-[20px]">
          {item.key !== FlowsResultKey.ALL &&
            percentage !== undefined &&
            !Number.isNaN(percentage) && (
              <>
                <span className="badge badge-ghost mr-1">
                  {`${percentage.toFixed()}%`}
                </span>
                {t('overviewPage.overviewBox.fromTotal')}
              </>
            )}
          {item.key === FlowsResultKey.ALL && <PreviousPeriodDiffLabel />}
        </div>
      </div>
    </button>
  )
}

export const BackgroundCountOverviewBox = ({
  className,
}: BackgroundCountOverviewBoxProps) => {
  const { t } = useTranslation()
  return (
    <div className={classNames('content-box space-y-2', className)}>
      <div className="font-bold">{t('overviewPage.overviewBox.title')}</div>
      <div className="block space-y-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:space-y-0">
        {boxes.map((item) => (
          <Box key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}
