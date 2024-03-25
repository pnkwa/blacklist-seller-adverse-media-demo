import i18n from 'i18n'
import { CriminalRecord, SocialSecurityHistory } from 'types/bgcCore'
import { CRValidations } from 'types/bgcCore/failedReason'
import { getMasterdataTranslation } from './translations'
import { getUniqueStrings } from './string'

export const getCRReasonRemark = ({
  results,
  verified,
  failedReasons,
}: CriminalRecord): string | undefined => {
  const foundRecord = results?.some((item) => item.foundRecord)

  // no remark if not found criminal record
  if (verified && !foundRecord) return undefined

  // return remark if passed but found criminal record
  if (verified && foundRecord)
    return i18n.t('caseDetail.crSSH.criminalRecord.remark.verifiedWithRecords')

  const minJudgementDayError = failedReasons.find(
    (item) => item.key === CRValidations.MIN_JUDGEMENT_DAY
  )

  // not passed but have no criteria
  if (!minJudgementDayError?.details)
    return i18n.t('caseDetail.crSSH.criminalRecord.remark.notVerified')

  const criminalRecordTypes = getUniqueStrings(
    minJudgementDayError.details
      .map((item) =>
        item.failedTags.map((t) => getMasterdataTranslation(t) ?? '')
      )
      .filter((item) => item)
      .flat()
  ).join(', ')

  // not passed and have minJudgementDay criteria
  return i18n.t('caseDetail.crSSH.criminalRecord.remark.minJudgementDay', {
    criminalRecordTypes,
  })
}

export const getSSHReasonRemark = ({
  verified,
  failedReasons,
}: SocialSecurityHistory) => {
  if (verified) return undefined

  // failed due to no ssh record
  if (!failedReasons.length)
    return i18n.t(
      'caseDetail.crSSH.socialSecurityHistory.remark.notVerifiedNoRecord'
    )

  const reasons = failedReasons
    .map((item) =>
      i18n.t(`caseDetail.crSSH.socialSecurityHistory.remark.${item.key}`)
    )
    .join(', ')

  // failed due to criteria
  return i18n.t(
    'caseDetail.crSSH.socialSecurityHistory.remark.notVerifiedWithFailedReasons',
    { reasons }
  )
}
