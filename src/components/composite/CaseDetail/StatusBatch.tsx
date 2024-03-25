import classNames from 'classnames'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BackgroundCheck } from 'types/bgcCore'
import {
  getBatchStatus,
  getStatusBatchColor,
} from 'utils/caseKeeperCore/processesConfig'

interface StatusCheckProps {
  backgroundCheck?: BackgroundCheck
  process: string
}

const StatusBatch: FC<StatusCheckProps> = ({ backgroundCheck, process }) => {
  const { t } = useTranslation()

  const status = useMemo(
    () => backgroundCheck && getBatchStatus(backgroundCheck, process),
    [backgroundCheck, process]
  )

  const color = useMemo(() => getStatusBatchColor(status), [status])

  return (
    <div
      className={classNames(
        'p-2 font-bold rounded-lg capitalize text-xs text-center',
        `bg-opacity-10 bg-${color} text-${color}`
      )}
    >
      {t(`status.batchStatus.${status}`)}
    </div>
  )
}

export default StatusBatch
