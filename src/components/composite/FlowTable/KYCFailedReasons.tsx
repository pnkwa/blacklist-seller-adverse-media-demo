import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TooltipBox } from 'components/base/TooltipBox'
import { Flow } from 'types/caseKeeperCore'
import { getUniqueStrings } from 'utils/string'
import { getKYCFailedReasons } from 'utils/verificationResult'

interface KYCFailedReasonsProps {
  flow: Flow
  maxDisplayItems?: number
}

export const KYCFailedReasons = ({
  flow,
  maxDisplayItems = Infinity,
}: KYCFailedReasonsProps) => {
  const { t } = useTranslation()

  const reasons = useMemo(() => {
    const reasons = getKYCFailedReasons(flow)?.map((reason) =>
      t(`failedReasons.${reason.process}.${reason.errorKey}`, {
        defaultValue: t(`failedReasons.${reason.process}.default`),
      })
    )
    return reasons && getUniqueStrings(reasons)
  }, [flow, t])

  const isExceedMax = useMemo(
    () => !!reasons?.length && reasons.length > maxDisplayItems,
    [maxDisplayItems, reasons?.length]
  )

  if (!reasons?.length) return '-'

  return (
    <div className="text-sm relative sm:pt-0">
      <div className="pb-1">{reasons.slice(0, maxDisplayItems).join(', ')}</div>
      {isExceedMax && (
        <div className="" style={{ textAlign: 'inherit' }}>
          <span className="mx-1 whitespace-nowrap">
            +
            {t('failedReasons.reasonsCount', {
              count: reasons.length - maxDisplayItems,
            })}
          </span>
          <TooltipBox
            tooltipContent={
              <ul className="list-disc list-outside pl-4 space-y-2">
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            }
            wrapperClassName="inline"
            tooltipClassName="right-0 !left-auto"
          >
            <FontAwesomeIcon
              icon={faInfo}
              className="p-0.5 rounded-full border w-2 h-2 text-neutral border-neutral"
            />
          </TooltipBox>
        </div>
      )}
    </div>
  )
}
