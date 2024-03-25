import { NotifyType, VerificationStatus } from 'types/kycCore'
import { Flow, FlowInput, FlowsResultKey } from 'types/caseKeeperCore'
import { clientBGCProcesses, clientKYCProcesses } from 'config/processes'
import { MOBILE_PHONE_VALIDATION } from './regex'

const formatPhoneNumber = (phoneNumber?: string | null) =>
  phoneNumber?.replace(MOBILE_PHONE_VALIDATION, '$1-$2-$3')

interface NotifySources {
  phoneNumber?: string | null
  email?: string | null
}

export const selectContactByType =
  (notifyType?: NotifyType, shouldFormatValue?: boolean) =>
  (...notifySources: (NotifySources | undefined)[]) => {
    if (!notifySources) return undefined
    const phoneNumber = notifySources.find((v) => v?.phoneNumber)?.phoneNumber
    const formattedPhoneNumber = shouldFormatValue
      ? formatPhoneNumber(phoneNumber)
      : phoneNumber
    const email = notifySources.find((v) => v?.email)?.email
    return notifyType === NotifyType.EMAIL ? email : formattedPhoneNumber
  }

export const getContact = (
  flow: Pick<Flow, 'verification' | 'proprietor'> | undefined,
  shouldFormatValue?: boolean
) => {
  if (!flow) return undefined
  const { proprietor, verification } = flow
  return selectContactByType(verification?.notifyType, shouldFormatValue)(
    verification,
    proprietor
  )
}

export const getColumnTogglesLocalStorageKey = (key: FlowsResultKey) =>
  `bgc-columns-${key}`

export const getFlowIdentity = (inputs: FlowInput[]) =>
  inputs.reduce(
    (names, { proprietor }) => {
      const data = {}
      ;['firstName', 'middleName', 'lastName'].forEach((k) => {
        if (!proprietor?.[k]) return
        data[k] = proprietor?.[k]
      })
      names.push(data)
      return names
    },
    [] as Partial<{ firstName: string; middleName: string; lastName: string }>[]
  )

const getFlowProprietorQuery = (key: string, data: string) => ({
  [`proprietor-${key}-$eq`]: data,
})

export const getFlowIdentityQuery = (
  inputs: FlowInput[]
): Record<string, string>[] =>
  getFlowIdentity(inputs).reduce(
    (
      prev: Partial<{
        firstName: string
        middleName: string
        lastName: string
      }>[],
      names
    ) => {
      const query = {}
      Object.keys(names).forEach((k) =>
        Object.assign(query, getFlowProprietorQuery(k, names[k]))
      )
      return [...prev, query]
    },
    []
  )

export const getLatestClientProcess = (flow: Flow) => {
  if (flow.verification?.status === VerificationStatus.OPEN) return 'open'
  const lastKycProcess = clientKYCProcesses.find(
    (process) =>
      flow.verification?.[`${process}Config`].required &&
      !flow.verification?.[`${process}Result`]?.completed
  )
  const lastBackgroundProcess = clientBGCProcesses.find(
    (process) =>
      flow.backgroundCheck?.processConfigs?.[process] &&
      !flow.backgroundCheck?.[process]?.clientSubmitted
  )
  return lastKycProcess ?? lastBackgroundProcess
}

export const getZipFileName = (flow: Flow) =>
  flow.verification?.firstName ?? flow.id?.slice(0, 8)
