import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import {
  BackgroundCheck,
  BackgroundCheckProcessName,
  CRSSH,
  CRSSHOperationStatus,
} from 'types/bgcCore'
import { Flow } from 'types/caseKeeperCore'
import { Table } from 'components/base/Table'
import { rotateWaterMark } from 'utils/watermark'
import { joinStrings, maskCitizenId } from 'utils/string'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { CRSSHTableSpecs, crSSHTableSpecs } from 'specs/crSSHTableSpecs'
import WarningIcon from 'assets/svg/icon-warning.svg?react'
import { dateFormat } from 'utils/date'
import { dateFormats } from 'config/dateFormats'
import { getCRReasonRemark, getSSHReasonRemark } from 'utils/reasonRemark'
import BaseBackgroundCheckDetail from '../BaseBackgroundCheckDetail'

interface CRSSHSectionProps {
  flow?: Flow
  process:
    | BackgroundCheckProcessName.CRIMINAL_RECORD
    | BackgroundCheckProcessName.SOCIAL_SECURITY_HISTORY
}

const CRSSHSection: FC<CRSSHSectionProps> = ({ flow, process }) => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()
  const { userInfo } = useCaseKeeperContext()

  const { backgroundCheck, proprietor } = flow ?? {}
  const { verificationInfo } = backgroundCheck ?? {}
  const { ccDashboardWatermarkText, evDashboardWatermarkText } =
    client.caseKeeperConfig ?? {}

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const relatedDivRef = useRef<HTMLDivElement | null>(null)
  const [canvasWidth, setCanvasWidth] = useState(1920)
  const [canvasHeight, setCanvasHeight] = useState(1080)

  const watermarkText = useMemo(() => {
    const textConfig =
      process === BackgroundCheckProcessName.CRIMINAL_RECORD
        ? ccDashboardWatermarkText
        : evDashboardWatermarkText
    return textConfig
      ? t(textConfig, {
          ...proprietor,
          companyName: client?.companyName?.th,
          date: dateFormat(moment(), 'DD/MM/YY'),
          userInfo,
        })
      : null
  }, [
    ccDashboardWatermarkText,
    client?.companyName?.th,
    evDashboardWatermarkText,
    proprietor,
    process,
    t,
    userInfo,
  ])

  const result = useMemo(
    () => backgroundCheck?.[process] as CRSSH | undefined,
    [backgroundCheck, process]
  )

  const resultHeaderText = useMemo(
    () => (
      <div className="font-bold text-xs">
        <p>
          {verificationInfo
            ? getVerificationInfoFullName(verificationInfo)
            : '-'}
        </p>
        {joinStrings([
          t('caseDetail.crSSH.citizenId'),
          maskCitizenId(verificationInfo?.citizenId),
        ])}
      </div>
    ),
    [t, verificationInfo]
  )

  const resultTable = useMemo(() => {
    const results = result?.results
    if (!results) return null

    const reasonRemark =
      process === BackgroundCheckProcessName.CRIMINAL_RECORD
        ? getCRReasonRemark(result)
        : getSSHReasonRemark(result)

    const mapResult: CRSSHTableSpecs[] = results.map(
      ({ remark, detail, inspectionSystem, startDate, endDate }, index) => {
        let result
        if (process === BackgroundCheckProcessName.CRIMINAL_RECORD) {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          result = detail || t('caseDetail.crSSH.notFoundRecord')
        } else {
          result = detail
            ? [
                detail,
                ...(startDate
                  ? [
                      t('caseDetail.crSSH.socialSecurityHistory.startWorking'),
                      dateFormat(startDate, dateFormats.dayMonthYear),
                    ]
                  : []),
                ...(endDate
                  ? [
                      t('caseDetail.crSSH.socialSecurityHistory.resigned'),
                      dateFormat(endDate, dateFormats.dayMonthYear),
                    ]
                  : []),
              ].join(' ')
            : t('caseDetail.crSSH.notFoundRecord')
        }
        return {
          order: `${index + 1}`,
          type: t(`caseDetail.crSSH.inspectionSystem.${inspectionSystem}`),
          result,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          remark: remark || '-',
          isValid:
            process === BackgroundCheckProcessName.CRIMINAL_RECORD
              ? !!detail
              : !detail,
        }
      }
    )

    return (
      <>
        {resultHeaderText}
        <div className="font-bold text-xs my-4">
          <div className="mb-4">
            {t(`caseDetail.crSSH.${process}.tableTitle`)}
          </div>
          {reasonRemark && (
            <div className="font-normal mb-4">{reasonRemark}</div>
          )}
          <div className="w-full overflow-x-auto">
            <Table
              key="crSSHTable"
              theadClassName="rounded-lg"
              tdClassName="px-0 pt-0 py-2 text-center sm:pb-4 sm:pt-4 sm:px-4"
              data={mapResult}
              tableSpecs={crSSHTableSpecs}
            />
          </div>
        </div>
        <div className="bg-white">
          <div className="flex gap-3 p-4 bg-warning/20 text-warning rounded-md items-center">
            <WarningIcon className="min-h-[1.5rem] min-w-[1.5rem]" />
            <span>{t('caseDetail.crSSH.resultWarning')}</span>
          </div>
        </div>
      </>
    )
  }, [process, result, resultHeaderText, t])

  const rejectedResult = useMemo(() => {
    if (result?.operationStatus !== CRSSHOperationStatus.REJECTED) return null
    const lastRemark = result?.remarks?.pop()
    return (
      <table className="font-bold text-xs">
        <tbody>
          <tr>
            <td className="pt-4 pr-4">{t('caseDetail.crSSH.result')}</td>
            <td className="pt-4 text-error">
              {t('caseDetail.crSSH.rejected')}
            </td>
          </tr>
          <tr>
            <td className="pt-4 align-top">{t('caseDetail.crSSH.remark')}</td>
            <td className="pt-4 font-normal whitespace-pre-wrap">
              {lastRemark?.content}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }, [result?.operationStatus, result?.remarks, t])

  useEffect(() => {
    const relatedDiv = relatedDivRef?.current
    if (!relatedDiv) return undefined
    const resizeObserver = new ResizeObserver(() => {
      setCanvasWidth(relatedDiv.clientWidth)
      setCanvasHeight(relatedDiv.clientHeight)
    })

    resizeObserver.observe(relatedDiv)

    return () => resizeObserver.unobserve(relatedDiv)
  }, [])

  useEffect(() => {
    if (!resultTable && !rejectedResult) return
    rotateWaterMark(canvasRef, watermarkText, canvasWidth, canvasHeight)
  }, [canvasHeight, canvasWidth, rejectedResult, resultTable, watermarkText])

  return (
    <BaseBackgroundCheckDetail
      backgroundCheck={backgroundCheck as BackgroundCheck}
      process={process}
    >
      <div className="relative shadow-md rounded-lg text-base-content select-none w-full">
        {watermarkText && (
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="absolute text-base-content -z-1"
          />
        )}
        <div ref={relatedDivRef} className="relative top-0 right-0 p-4 z-1">
          <div className="w-full">
            {result?.operationStatus !== CRSSHOperationStatus.REJECTED
              ? resultTable
              : rejectedResult}
          </div>
        </div>
      </div>
    </BaseBackgroundCheckDetail>
  )
}

export default CRSSHSection
