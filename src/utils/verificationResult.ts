import { Flow, Verification } from 'types/caseKeeperCore'
import { KYCProcessName, VerificationProcess } from 'types/kycCore'

const getParentResult = (
  verification: Verification | undefined | null,
  processName: KYCProcessName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any | undefined | null =>
  verification?.reusedResults?.find((e) => e === processName) &&
  verification.verification?.[`${processName}Result`]

export const getVerifyableResult = <P extends KYCProcessName>(
  verification: Verification | undefined | null,
  processName: P
): Verification[`${P}Result`] =>
  verification?.[`${processName}Result`] ??
  getParentResult(verification, processName)

interface FailedReason {
  process: VerificationProcess
  errorKey: string
}

/**
 * returns array of kyc failed reason object and translations
 * ex: ['failedReasons.frontIdCard.comparison', 'failedReasons.frontIdCard.expired']
 */
export const getKYCFailedReasons = (flow: Flow) => {
  if (!flow.verification) return null
  const reasons: FailedReason[] = []
  Object.values(VerificationProcess).forEach((process) => {
    const result = getVerifyableResult(
      flow.verification,
      process as KYCProcessName
    )
    if (!result?.completed || result?.valid) return undefined
    if (!result?.errors) return reasons.push({ process, errorKey: 'default' })
    return reasons.push(
      ...result.errors.map((err) => ({ process, errorKey: err.key }))
    )
  })
  return reasons
}
