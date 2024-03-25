import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import AccountCircleDisabled from 'assets/svg/icon-account-circle-disabled.svg?react'
import { Flow, Event } from 'types/caseKeeperCore'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { sortByKey } from 'utils/common'
import { dateFormats } from 'config/dateFormats'
import {
  getPassportFromFlow,
  getCitizenIdFromFlow,
  getDateOfBirthFromFlow,
} from 'utils/caseKeeperCore/data'
import { NotifyType } from 'types/kycCore'
import { getLatestClientProcess, selectContactByType } from 'utils/flow'
import { dateFormat } from 'utils/date'
import ImageWithCaptionCard from './ImageWithCaptionCard'

interface OverviewProps {
  id?: string
  flow?: Flow
  name: string
  className?: string
}

const Overview: FC<OverviewProps> = ({ id, flow, name, className }) => {
  const { t } = useTranslation()
  const { fetchEvents } = useCaseKeeperContext()
  const [sendLinkLatestDate, setSendLinkLatestDate] = useState<Date>()

  const getHistorySendNotification = useCallback(async () => {
    const { id } = flow ?? {}
    if (!id) return
    const flowEvents = await fetchEvents({
      'key-$in': 'flow.created,flow.notification.sent',
      dataId: id,
    })
    const sorted = flowEvents.data.sort(sortByKey('createdAt')) as Event<Flow>[]
    setSendLinkLatestDate(sorted[0]?.createdAt)
  }, [fetchEvents, flow])

  const imageUrl = useMemo(() => {
    if (!flow) return null
    const { verification: v, backgroundCheck: b } = flow
    return (
      v?.frontIdCardResult?.faceImageUrl ??
      v?.frontIdCardResult?.idCardImageUrl ??
      v?.passportResult?.faceImageUrl ??
      b?.verificationInfo.idCardFaceImageUrl ??
      b?.verificationInfo.frontIdCardImageUrl
    )
  }, [flow])

  const isPassport = useMemo(
    () => flow?.verification?.passportConfig.required,
    [flow?.verification?.passportConfig.required]
  )

  const dataPoints = useMemo(() => {
    return [
      {
        key: isPassport ? 'passportNumber' : 'citizenId',
        value: isPassport
          ? getPassportFromFlow(flow)
          : getCitizenIdFromFlow(flow),
      },
      {
        key: 'dateOfBirth',
        value: dateFormat(
          getDateOfBirthFromFlow(flow),
          dateFormats.displayDate
        ),
      },
      {
        key: 'createdBy',
        value: flow?.user?.email,
      },
      {
        key: 'updatedAt',
        value:
          flow?.updatedAt &&
          dateFormat(flow?.updatedAt, dateFormats.dayMonthYearDateTime),
      },
      {
        key: 'phoneNumber',
        value: selectContactByType(NotifyType.SMS)(
          flow?.verification,
          flow?.proprietor
        ),
      },
      {
        key: 'email',
        value: selectContactByType(NotifyType.EMAIL)(
          flow?.verification,
          flow?.proprietor
        ),
      },
      {
        key: 'sendLinkDate',
        value:
          sendLinkLatestDate &&
          dateFormat(sendLinkLatestDate, dateFormats.dayMonthYearDateTime),
      },
      {
        key: 'currentStep',
        value: flow && t(`latestClientProcess.${getLatestClientProcess(flow)}`),
      },
    ]
  }, [t, isPassport, flow, sendLinkLatestDate])

  useEffect(() => {
    getHistorySendNotification()
  }, [getHistorySendNotification])

  return (
    <div
      id={id}
      className={classNames(
        'rounded-lg bg-base-100 text-base-content shadow-md',
        className
      )}
    >
      <div className="text-base-content flex flex-col sm:flex-row transition-all p-4">
        <ImageWithCaptionCard
          className="flex-1"
          src={imageUrl}
          svgIcon={AccountCircleDisabled}
          title={t('caseDetail.overview.mugshotTitle')}
          description={t('caseDetail.overview.mugshotDescription')}
        />
        <div className="w-full col-span-4 p-4">
          <h1 className="text-2xl font-bold mb-6">{name}</h1>
          <div className="border my-4" />
          <div className="w-full grid lg:grid-cols-4  sm:grid-cols-2 grid-flow-row">
            {dataPoints.map((dataPoint) => (
              <div key={`overview_${dataPoint.key}`}>
                <h3 className="text-sm font-bold">
                  {t(`caseDetail.overview.${dataPoint.key}`)}
                </h3>
                <div className="text-base-content text-xs mt-1 mb-4">
                  {dataPoint?.value ?? '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
