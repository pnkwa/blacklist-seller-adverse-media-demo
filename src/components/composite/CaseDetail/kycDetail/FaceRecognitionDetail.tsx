import { FC, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import ErrorsBox from 'components/base/ErrorsBox'
import { Table } from 'components/base/Table'
import { Verification } from 'types/caseKeeperCore'
import {
  FaceRecognitionResult,
  LivenessResult,
  ResultStatus,
  VerificationProcess,
} from 'types/kycCore'
import { dateFormats } from 'config/dateFormats'
import { livenessSpace } from 'specs/livenessSpecs'
import { sortByKey } from 'utils/common'
import { dateFormat } from 'utils/date'
import AttemptTitle from './AttemptTitle'

interface FaceRecognitionDetailProps {
  showAttempts?: boolean
  verification: Verification
}

const ImageLink: React.FC<{ url?: string; size?: 'md' | 'xs' }> = ({
  url,
  size = 'md',
}) => (
  <a aria-label="ImageLink" href={url} target="_blank" rel="noreferrer">
    <img
      alt={url}
      src={url}
      className={classNames(size === 'md' ? 'w-40 max-h-60' : 'w-20 max-h-24')}
    />
  </a>
)

const getResultStatus =
  (key: VerificationProcess) => (v: Partial<Verification>) => {
    const { valid } = v?.[`${key}Result`] ?? {}
    if (valid === undefined) return undefined
    return valid ? ResultStatus.PASSED : ResultStatus.FAILED
  }

const getLivenessResponse = getResultStatus(VerificationProcess.LIVENESS)
const getFaceRecognitionResponse = getResultStatus(
  VerificationProcess.FACE_RECOGNITION
)

interface Detail {
  className: string
  livenessResult: LivenessResult
  faceRecognitionResult?: FaceRecognitionResult
}

const LivenessDetail = ({
  livenessResult,
  faceRecognitionResult,
  className,
}: Detail) => {
  const sourceImageUrl = faceRecognitionResult?.sourceImageUrl

  const targetImageUrl =
    faceRecognitionResult?.targetImageUrl ?? livenessResult?.livenessImageUrl

  const errorCode = livenessResult.response?.errors?.code
  const { livenessVideoUrl, livenessFrameMatches } = livenessResult
  const showVideo =
    livenessVideoUrl &&
    [
      'liveness-detection-failed',
      'video-frames-spoofing-detection-failed',
    ].includes(errorCode)
  const showFrames =
    !livenessVideoUrl &&
    livenessFrameMatches &&
    [
      'liveness-detection-failed',
      'video-frames-spoofing-detection-failed',
    ].includes(errorCode)

  return (
    <div
      className={classNames(
        'flex justify-center items-center gap-x-2',
        'flex-row my-6 overflow-x-auto min-h-24',
        className
      )}
    >
      {showVideo && (
        <video
          aria-label="livenessFail"
          controls
          controlsList="nodownload"
          className="px-1 w-40 max-h-60"
          src={livenessVideoUrl}
        >
          <track kind="captions" />
        </video>
      )}
      {showFrames &&
        livenessFrameMatches
          .filter((lfm) => !!lfm.livenessFrameUrl)
          .slice(0, 5)
          .map((lfm) => (
            <ImageLink
              key={lfm.livenessFrameKey}
              url={lfm.livenessFrameUrl}
              size="md"
            />
          ))}
      {!showVideo && !showFrames && (
        <>
          {sourceImageUrl && <ImageLink url={sourceImageUrl} />}
          {targetImageUrl && <ImageLink url={targetImageUrl} />}
        </>
      )}
    </div>
  )
}

const FaceRecognitionDetail: FC<FaceRecognitionDetailProps> = ({
  verification,
  showAttempts = false,
}) => {
  const { t } = useTranslation()

  const livenessResults = useMemo(
    () =>
      verification?.livenessResults
        ?.sort(sortByKey('updatedAt'))
        .slice(showAttempts ? 1 : 0, showAttempts ? undefined : 1) ?? [],
    [showAttempts, verification?.livenessResults]
  )

  const livenessResultsLength = useMemo(
    () => verification.livenessResults?.length ?? 0,
    [verification.livenessResults?.length]
  )

  const getFaceRecognitionResult = useCallback(
    (livenessResult: LivenessResult) =>
      verification.faceRecognitionResults?.find(
        (fr) => fr.livenessResultId === livenessResult.id
      ),
    [verification?.faceRecognitionResults]
  )

  const getError = useCallback(
    ({ livenessResult, faceRecognitionResult }) => {
      const filterAndMap = (array, transform = (error) => error) =>
        array ? array.filter(Boolean).map(transform) : []

      return [
        ...filterAndMap(faceRecognitionResult?.errors, (error) => ({
          key: t(`failedReasons.faceRecognition.${error.key}`),
        })),
        ...filterAndMap(
          livenessResult?.faceAttributes,
          (error) =>
            error && { key: t(`failedReasons.faceAttributes.${error}`) }
        ),
      ]
    },
    [t]
  )

  const getFaceRecognitionData = useCallback(
    ({ livenessResult, faceRecognitionResult, index }) => {
      const livenessPassed = getLivenessResponse({
        ...verification,
        livenessResult,
      })

      const faceComparisonPassed = getFaceRecognitionResponse({
        ...verification,
        faceRecognitionResult,
        livenessResult,
      })

      return [
        {
          verificationDate:
            livenessResult?.updatedAt &&
            dateFormat(livenessResult?.updatedAt, dateFormats.dayMonthYear),
          verificationTime:
            livenessResult?.updatedAt &&
            moment(livenessResult?.updatedAt).format(dateFormats.isoTime),
          liveness: livenessResult && {
            label: livenessPassed && t(`generic.${livenessPassed}`),
            value: livenessPassed === ResultStatus.PASSED,
          },
          faceComparison: faceRecognitionResult && {
            label: t(`generic.${faceComparisonPassed}`),
            value: faceComparisonPassed === ResultStatus.PASSED,
          },
          remark:
            index + 1 === livenessResults?.length && !showAttempts
              ? verification.feedback
              : '-',
        },
      ]
    },
    [livenessResults?.length, showAttempts, t, verification]
  )

  return (
    <div>
      {livenessResults?.map((livenessResult, index) => {
        const faceRecognitionResult = getFaceRecognitionResult(livenessResult)
        const errors = getError({ faceRecognitionResult, livenessResult })
        return (
          <>
            <AttemptTitle
              errorTranslationPrefix="caseDetail.verification.attempt.faceRecognition"
              count={livenessResultsLength - index - (showAttempts ? 1 : 0)}
              date={livenessResult.updatedAt}
            />
            <div className="mb-8 sm:mb-2">
              <div className="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-none items-center mb-6 sm:mb-0">
                <LivenessDetail
                  className={classNames(
                    'w-full mb-6 my-3',
                    !errors?.length && 'sm:col-span-2 row-span-2'
                  )}
                  livenessResult={livenessResult}
                  faceRecognitionResult={faceRecognitionResult}
                />
                {!!errors.length && <ErrorsBox errors={errors} />}
              </div>
              <div className="w-full overflow-x-auto">
                <Table
                  key="faceRecognitionTable"
                  theadClassName="rounded-lg"
                  tableClassName="min-w-[600px] lg:w-full"
                  tdClassName="px-0 py-2 sm:pb-4 sm:pt-4 sm:px-4"
                  rowClassName="border-none"
                  data={getFaceRecognitionData({
                    livenessResult,
                    faceRecognitionResult,
                    index,
                  })}
                  tableSpecs={livenessSpace}
                />
              </div>
            </div>
          </>
        )
      })}
    </div>
  )
}

export default FaceRecognitionDetail
