import moment from 'moment'
import {
  BackgroundApprovalStatus,
  BackgroundCheck,
  BackgroundCheckProcessName,
  BackgroundCheckStatus,
} from 'types/bgcCore'

/**
 * return expired if the date passed expiry while
 * the client have not finished their flow
 */
export const getDisplayedBackgroundCheckStatus = (
  backgroundCheck: BackgroundCheck | undefined
) => {
  const { status, expiresAt, approvalStatus } = backgroundCheck ?? {}
  if (
    (status === BackgroundCheckStatus.OPEN ||
      status === BackgroundCheckStatus.PENDING_CLIENT) &&
    expiresAt &&
    moment().isAfter(expiresAt)
  )
    return BackgroundCheckStatus.EXPIRED

  if (approvalStatus !== BackgroundApprovalStatus.UNSPECIFIED)
    return approvalStatus

  return status
}

export const getRequiredProcesses = (
  backgroundCheck: BackgroundCheck | undefined
) =>
  Object.values(BackgroundCheckProcessName).filter(
    (key) => backgroundCheck?.processConfigs?.[key]
  )

/**
 * returns the default setting to show/hide a certain column
 * only some columns will defaults to be hidden
 */
export const getDefaultDisplayColumn = (key: string) =>
  !['tags', 'ownerEmail'].includes(key)
