import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Flow } from 'types/caseKeeperCore'
import { isS3URLExpired } from 'utils/s3'
import { getFirstLetter } from 'utils/string'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import { getVerifyableResult } from 'utils/verificationResult'

interface ImageValue {
  getUrl: (
    flow: Pick<Flow, 'backgroundCheck' | 'verification'>
  ) => string | null | undefined
  source: 'kyc' | 'bgc'
}

const avatarValues: ImageValue[] = [
  {
    source: 'bgc',
    getUrl: (flow) => flow.backgroundCheck?.verificationInfo?.livenessImageUrl,
  },
  {
    source: 'bgc',
    getUrl: (flow) =>
      flow.backgroundCheck?.verificationInfo?.idCardFaceImageUrl,
  },
  { source: 'kyc', getUrl: (flow) => flow.verification?.faceImageUrl },
  {
    source: 'kyc',
    getUrl: (flow) =>
      getVerifyableResult(flow.verification, 'frontIdCard')?.faceImageUrl,
  },
  {
    source: 'kyc',
    getUrl: (flow) =>
      getVerifyableResult(flow.verification, 'passport')?.faceImageUrl,
  },
]

export const FlowAvatarImage = ({
  flow,
  className,
}: {
  flow: Flow | undefined
  className?: string
}) => {
  const { i18n } = useTranslation()
  const { fetchVerificationById, fetchBackgroundCheckById } =
    useCaseKeeperContext()
  const { backgroundCheck } = flow ?? {}
  const { verificationInfo } = backgroundCheck ?? {}
  const [url, setUrl] = useState<string | null | undefined>()

  const imageValue = useMemo(
    () => flow && avatarValues.find((item) => item.getUrl(flow)),
    [flow]
  )

  const nameInitials = useMemo(
    () =>
      verificationInfo &&
      getVerificationInfoFullName(verificationInfo, false, i18n.language)
        .split(' ')
        .slice(0, 2)
        .map(getFirstLetter)
        .join(''),
    [verificationInfo, i18n.language]
  )

  /** handle url expiration */
  useEffect(() => {
    if (!imageValue || !flow) return
    const { getUrl, source } = imageValue
    const url = getUrl(flow)
    if (!url) return
    if (!isS3URLExpired(url)) setUrl(url)
    else if (source === 'bgc' && flow.backgroundCheckId) {
      fetchBackgroundCheckById(flow.backgroundCheckId).then((backgroundCheck) =>
        setUrl(getUrl({ backgroundCheck }))
      )
    } else if (source === 'kyc' && flow.verificationId) {
      fetchVerificationById(flow.verificationId).then((verification) =>
        setUrl(getUrl({ verification }))
      )
    }
  }, [imageValue, flow, fetchBackgroundCheckById, fetchVerificationById])

  return (
    <div className="avatar placeholder">
      <div
        className={classNames(
          'w-6 rounded-full bg-neutral/50 text-base-100',
          className
        )}
      >
        {url ? (
          <img src={url} alt={nameInitials} />
        ) : (
          <span className="text-xs">{nameInitials}</span>
        )}
      </div>
    </div>
  )
}
