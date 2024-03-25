import moment from 'moment'
import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { TooltipBox } from 'components/base/TooltipBox'
import { getDateLabel } from 'utils/datePicker'
import { FlowsResultKey } from 'types/caseKeeperCore'
import { getFilterCreatedAtRange, getFlowsResultCount } from 'reducers'
import { getPreviousPeriodDateRange } from 'utils/date'
import { calculatePreviousCountChanges } from 'utils/number'

export const PreviousPeriodDiffLabel = () => {
  const { t } = useTranslation()

  const everyStatusCount = useSelector(getFlowsResultCount(FlowsResultKey.ALL))
  const previousPeriodCount = useSelector(
    getFlowsResultCount(FlowsResultKey.PREVIOUS_PERIOD)
  )
  const createdAtRange = useSelector(getFilterCreatedAtRange)
  const previousPeriodRange = getPreviousPeriodDateRange(createdAtRange)

  const diffResult = useMemo(() => {
    if (everyStatusCount === undefined || previousPeriodCount === undefined)
      return undefined
    return calculatePreviousCountChanges(everyStatusCount, previousPeriodCount)
  }, [previousPeriodCount, everyStatusCount])

  const renderLabel = useMemo(() => {
    if (!diffResult) return null

    const { diff, percentDiff } = diffResult
    const isIncreased = percentDiff > 0
    const hasDiff = diff !== 0
    const days =
      moment(previousPeriodRange[1]).diff(previousPeriodRange[0], 'days') + 1
    const percentLabel = `(${isIncreased ? '+' : ''}${percentDiff.toFixed()}%)`

    const colorClass = isIncreased ? 'text-success' : 'text-error'

    return (
      <>
        {hasDiff && (
          <FontAwesomeIcon
            icon={isIncreased ? faCaretUp : faCaretDown}
            className={colorClass}
          />
        )}
        {hasDiff ? (
          <span className={colorClass}>
            {t('generic.caseCount', { count: Math.abs(diff) })}
          </span>
        ) : (
          <span>{t('overviewPage.overviewBox.noDiff')}</span>
        )}
        {hasDiff && !!previousPeriodCount && (
          <span className={colorClass}>{percentLabel}</span>
        )}
        <span>
          {t('overviewPage.overviewBox.diffDaychanges', { count: days })}
        </span>
      </>
    )
  }, [diffResult, previousPeriodCount, previousPeriodRange, t])

  if (!diffResult) return null

  return (
    <TooltipBox
      tooltipContent={
        <>
          <div>{t('overviewPage.overviewBox.diffTooltip')}</div>
          <div>
            {getDateLabel(previousPeriodRange)} (
            {t('generic.caseCount', { count: previousPeriodCount })})
          </div>
        </>
      }
      wrapperClassName="max-w-fit space-x-1"
    >
      {renderLabel}
    </TooltipBox>
  )
}
