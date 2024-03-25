import classNames from 'classnames'
import { FC, Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import VerifyBadge from 'components/base/VerifyBadge'
import { TabItemConfig } from 'types/generic/tabs'
import { Verification } from 'types/caseKeeperCore'
import { VerificationProcess } from 'types/kycCore'

interface OverviewProps {
  className?: string
  config: TabItemConfig[]
  verification: Verification
}

const Overview: FC<OverviewProps> = ({ className, config, verification }) => {
  const { t } = useTranslation()
  const getVerified = useCallback(
    (key) => {
      if (key === VerificationProcess.LIVENESS)
        return (
          verification.livenessResult?.verified &&
          verification.faceRecognitionResult?.verified
        )

      return verification?.[`${key}Result`]?.verified
    },
    [verification]
  )

  return (
    <div
      className={classNames(
        'grid grid-cols-2 w-full sm:w-1/2 gap-2 py-4',
        className
      )}
    >
      {config
        .filter(({ key }) => key !== 'overview')
        .map(({ key }) => {
          const verified = getVerified(key)
          return (
            <Fragment key={key}>
              <div className="flex items-center">{t(`processes.${key}`)}</div>
              <VerifyBadge
                label={verified ? 'generic.passed' : 'generic.failed'}
                verified={verified}
              />
            </Fragment>
          )
        })}
    </div>
  )
}

export default Overview
