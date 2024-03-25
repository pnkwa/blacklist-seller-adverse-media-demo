/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Field } from 'components/base/Field'
import {
  BackgroundCheck,
  BackgroundCheckProcessName,
  Transcript,
  TranscriptCheckMethod,
  TranscriptCheckResult,
} from 'types/bgcCore'
import FileIcon from 'assets/svg/icon-fa-file.svg?react'
import { downloadURL } from 'utils/download'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import { Flow } from 'types/caseKeeperCore'
import VerifyBadge from 'components/base/VerifyBadge'
import { getCodeFromMasterdata } from 'utils/translations'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { isS3URLExpired } from 'utils/s3'
import BaseBackgroundCheckDetail from '../BaseBackgroundCheckDetail'

interface EducationSectionProps {
  flow?: Flow
}

const EducationItem: FC<{
  transcript: Transcript
  name: string
  backgroundCheckId?: string
}> = ({ transcript, name, backgroundCheckId }) => {
  const { t, i18n } = useTranslation()
  const { fetchBackgroundCheckById } = useCaseKeeperContext()
  const { institute, educationLevel, method, result, documentUrl, remark, id } =
    transcript

  const transcriptFileName = useMemo(() => {
    const instituteCode = getCodeFromMasterdata(institute, 'en')
    const educationLevelCode = getCodeFromMasterdata(educationLevel, 'en')
    return `Transcript_${instituteCode}_${educationLevelCode}_${name}`
  }, [educationLevel, institute, name])

  const downloadTranscript = useCallback(async () => {
    if (!documentUrl || !backgroundCheckId) return

    let url = documentUrl
    if (isS3URLExpired(documentUrl)) {
      const backgroundCheck = await fetchBackgroundCheckById(backgroundCheckId)
      url = backgroundCheck.education?.transcripts?.find((t) => t.id === id)
        ?.documentUrl as string
    }
    downloadURL(url, transcriptFileName)
  }, [
    backgroundCheckId,
    documentUrl,
    fetchBackgroundCheckById,
    id,
    transcriptFileName,
  ])

  return (
    <div className="space-y-2">
      <div>
        <p className="text-lg">
          {transcript?.institute?.translations?.[i18n?.language]}
        </p>
        <p className="text-neutral">
          {educationLevel.translations?.[i18n?.language]}
        </p>
      </div>
      <Field title="caseDetail.education.documentUrl">
        <button
          type="button"
          className="flex pt-2 lg:pt-0 gap-4 items-center cursor-pointer"
          onClick={downloadTranscript}
        >
          <FileIcon /> {transcriptFileName}
        </button>
      </Field>
      <Field title="caseDetail.education.method">
        {method &&
          method !== TranscriptCheckMethod.UNSPECIFIED &&
          t(`caseDetail.education.fields.method.${method}`)}
      </Field>
      <Field title="caseDetail.education.result">
        {result === TranscriptCheckResult.UNSPECIFIED ? (
          <div className="flex">-</div>
        ) : (
          <VerifyBadge
            verified={result === TranscriptCheckResult.VERIFIED}
            label={t(`caseDetail.education.fields.result.${result}`)}
          />
        )}
      </Field>
      <Field title="caseDetail.education.remark">{remark || '-'}</Field>
    </div>
  )
}

const EducationSection: FC<EducationSectionProps> = ({ flow }) => {
  const { backgroundCheck } = flow ?? {}
  const { transcripts } = backgroundCheck?.education ?? {}

  const name = useMemo(
    () =>
      backgroundCheck?.verificationInfo
        ? getVerificationInfoFullName(backgroundCheck?.verificationInfo, false)
        : '-',
    [backgroundCheck?.verificationInfo]
  )

  const sorted = useMemo(
    () =>
      [...(transcripts ?? [])].sort(
        (a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
      ),
    [transcripts]
  )

  return (
    <BaseBackgroundCheckDetail
      backgroundCheck={backgroundCheck as BackgroundCheck}
      process={BackgroundCheckProcessName.EDUCATION}
    >
      <div className="space-y-8">
        {sorted?.map((t) => (
          <EducationItem
            key={t.id}
            backgroundCheckId={backgroundCheck?.id}
            transcript={t}
            name={name}
          />
        ))}
      </div>
    </BaseBackgroundCheckDetail>
  )
}

export default EducationSection
