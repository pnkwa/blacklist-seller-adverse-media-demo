import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { BackgroundCheckStatus } from 'types/bgcCore'
import { Flow } from 'types/caseKeeperCore'

interface EvaluationResultLabelProps {
  flow: Flow
}

export const EvaluationResultLabel = ({ flow }: EvaluationResultLabelProps) => {
  const { t } = useTranslation()
  const { status } = flow.backgroundCheck ?? {}

  const verified = status === BackgroundCheckStatus.VERIFIED

  if (
    status !== BackgroundCheckStatus.COMPLETED &&
    status !== BackgroundCheckStatus.VERIFIED
  )
    return null

  return (
    <span
      className={classNames(
        'font-bold text-xs',
        verified ? 'text-success' : 'text-warning'
      )}
    >
      <FontAwesomeIcon
        icon={verified ? faCheckCircle : faXmarkCircle}
        className="mr-1 text-sm"
      />
      {t(`evaluationResultLabel.${status}`)}
    </span>
  )
}
