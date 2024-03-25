import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flow } from 'types/caseKeeperCore'
import { getRequiredProcesses } from 'utils/backgroundCheck'

interface ResultOverviewProps {
  flow: Flow
}

export const ResultOverview = ({ flow }: ResultOverviewProps) => {
  const { t } = useTranslation()

  const { backgroundCheck } = flow

  const processes = useMemo(
    () => getRequiredProcesses(backgroundCheck),
    [backgroundCheck]
  )

  const total = useMemo(() => processes.length, [processes])

  const count = useMemo(
    () => processes.filter((p) => backgroundCheck?.[p]?.verified).length,
    [backgroundCheck, processes]
  )

  return (
    <span className="text-base-content sm:text-neutral">
      {count === total
        ? t(`resultOverview.allPassed`)
        : t(`resultOverview.verifiedCount`, { count, total })}
    </span>
  )
}
