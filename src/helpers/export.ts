import i18next from 'i18next'
import i18n from 'i18n'
import { transactionTableSpecs } from 'specs/transactionTableSpecs'
import { BackgroundCheck } from 'types/bgcCore'
import { Flow, Verification } from 'types/caseKeeperCore'
import { Event } from 'types/caseKeeperCore/event'
import { Transaction } from 'types/exchange/transaction'
import { dateFormat } from 'utils/date'
import { joinStrings } from 'utils/string'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import { TableSpec } from 'types/generic/table'

interface SendLinkReport {
  'Sent date': string
  'Sent time': string | undefined
  Department: string
  Role: string
  'Position Type': string
  'Agent Name': string
  'Customer Name': string
  'Phone Number': string
  Email: string
  Channel: string
}

export const sendLinkReportMapping = (e: Event<Flow>): SendLinkReport => {
  const { createdAt, user, data } = e ?? {}
  const backgroundCheck = (data?.backgroundCheck as BackgroundCheck) ?? {}
  const verification = (data?.verification as Verification) ?? {}
  const { position, ...rest } = backgroundCheck?.verificationInfo ?? {}
  const proprietor = data?.proprietor

  const notifyType = verification?.notifyType ?? proprietor?.notifyType
  const email = verification.email ?? proprietor?.email
  const phoneNumber =
    verification?.phoneNumber?.toString() ?? proprietor?.phoneNumber?.toString()
  return {
    'Sent date': dateFormat(createdAt, undefined, '-'),
    'Sent time': createdAt && new Date(createdAt).toLocaleTimeString(),
    Department: user?.groups ? Object.values(user.groups).join(',') : '',
    Role: user?.role?.name ?? '',
    'Position Type':
      backgroundCheck?.verificationInfo?.position?.translations?.[
        i18n.language
      ] ?? '',
    'Agent Name': joinStrings([user?.firstName, user?.lastName]),
    'Customer Name': getVerificationInfoFullName(rest),
    'Phone Number': notifyType === 'sms' && phoneNumber ? phoneNumber : '',
    Email: notifyType === 'email' && email ? email : '',
    Channel: notifyType ?? '',
  }
}

export const transactionResultReportMapping = (transaction: Transaction) =>
  transactionTableSpecs.reduce(
    (acc, col) => ({
      ...acc,
      [i18n.t(col.header ?? col.key)]: col.renderValue?.(transaction),
    }),
    {}
  )

export const resultReportMapping =
  (columns: TableSpec<Flow>[]) => (flow: Flow) =>
    columns.reduce(
      (acc, col) => ({
        ...acc,
        [i18next.t(col.header ?? col.key)]: (
          col.getRawValue ?? col.renderValue
        )?.(flow),
      }),
      {}
    )
