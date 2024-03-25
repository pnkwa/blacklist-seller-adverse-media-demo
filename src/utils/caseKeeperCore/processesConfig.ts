import { BatchStatus, processesConfig } from 'config/processes'
import { BackgroundApprovalStatus } from 'types/bgcCore'
import { BackgroundCheck, ProcessConfigs } from 'types/bgcCore/backgroundCheck'

/**
 * Retrieves the icon status based on the background check process and status.
 * @param backgroundCheck - The background check object containing relevant information.
 * @param process - The specific process for which the icon status is being determined ('kyc', 'criminalRecord', etc.).
 * @returns IconStatus | null - The icon status corresponding to the given process and background check status.
 */
export const getBatchStatus = (
  backgroundCheck: BackgroundCheck,
  process: string
): BatchStatus => {
  /** Check KYC process status */
  if (process === 'kyc') {
    const { kycVerified, kycCompletedAt } = backgroundCheck.verificationInfo
    if (kycVerified) return BatchStatus.VERIFIED
    if (backgroundCheck.approvalStatus === BackgroundApprovalStatus.APPROVED)
      return BatchStatus.APPROVED
    if (backgroundCheck.approvalStatus === BackgroundApprovalStatus.REJECTED)
      return BatchStatus.REJECTED
    if (kycCompletedAt) return BatchStatus.NOT_VERIFIED

    /** Retrieve null if kyc still in progress. */
    return BatchStatus.IN_PROGRESS
  }

  /** Check other background check process status */
  const result = backgroundCheck?.[process]

  /**  Retrieve SUCCESS if background check verified. */
  if (result?.verified) return BatchStatus.CHECKED

  /**  Retrieve ERROR if background check done and not verified. */
  if (result?.completed) return BatchStatus.NEED_REVIEW

  /**  Retrieve null if background check still in progress. */
  return BatchStatus.IN_PROGRESS
}

export const getStatusBatchColor = (status?: BatchStatus | null) => {
  switch (status) {
    case BatchStatus.APPROVED:
    case BatchStatus.REJECTED:
      return 'warning'
    case BatchStatus.VERIFIED:
    case BatchStatus.CHECKED:
      return 'success'
    case BatchStatus.NOT_VERIFIED:
    case BatchStatus.NEED_REVIEW:
      return 'error'
    case BatchStatus.IN_PROGRESS:
    default:
      return 'neutral'
  }
}

/**
 * Retrieves a filtered list of background check processes based on the provided configuration
 * and additional Processes that your input such as KYC.
 *
 * @param processConfigs - The configuration object containing process details.
 * @param additionalProcesses - An optional array of additional process keys to include.
 *
 * Ex. @returns
 * [
 *   { key: 'kyc', title: 'processes.kyc' },
 *   { key: 'criminalRecord', title: 'processes.criminalRecord' },
 *   { key: 'education', title: 'processes.education' },
 *   { key: 'income', title: 'processes.income' },
 * ]
 */
export const filterProcesses = (
  processConfigs: ProcessConfigs,
  additionalProcesses: string[] = []
) => {
  const processKeys = new Set([
    ...Object.keys(processConfigs).filter((k) => processConfigs[k]),
    ...additionalProcesses,
  ])
  return processesConfig.filter((pc) => processKeys.has(pc.key))
}
