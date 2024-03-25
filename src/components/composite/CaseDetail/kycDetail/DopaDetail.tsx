import { FC, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import ErrorsBox from 'components/base/ErrorsBox'
import { Table } from 'components/base/Table'
import { Verification } from 'types/caseKeeperCore'
import DopaPending from 'assets/svg/dopa-pending.svg?react'
import DopaSuccess from 'assets/svg/dopa-success.svg?react'
import DopaFailed from 'assets/svg/dopa-failed.svg?react'
import { sortByKey } from 'utils/common'
import { dopaSpace } from 'specs/dopaSpecs'
import { DopaResult } from 'types/kycCore'
import { dateFormats } from 'config/dateFormats'
import { dateFormat } from 'utils/date'
import AttemptTitle from './AttemptTitle'

interface DopaDetailProps {
  showAttempts?: boolean
  verification: Verification
}

const dopaIcon = {
  pending: DopaPending,
  passed: DopaSuccess,
  failed: DopaFailed,
}

const getDopaStatus = (
  dopaResult: DopaResult
): 'passed' | 'failed' | 'pending' => {
  if (dopaResult?.dopaRequestFailed) return 'pending'
  return dopaResult?.verified ? 'passed' : 'failed'
}
const getDopaRequestFailedRemarkByStatusCode = (status: number) => {
  switch (status) {
    case 404:
      return 'ขณะนี้ระบบขัดข้อง รหัสข้อผิดพลาด 404 (ระบบจะขอผลการตรวจสอบอีกครั้ง กรุณาติดตามผลในอีก 1 ชั่วโมง)'
    case 429:
      return 'เซิร์ฟเวอร์ได้รับรีเควสจำนวนมากในระยะเวลาอันสั้น รหัสข้อผิดพลาด 429 (ระบบจะขอผลการตรวจสอบอีกครั้ง กรุณาติดตามผลในอีก 1 ชั่วโมง)'
    case 500:
      return 'ขณะนี้ระบบขัดข้อง รหัสข้อผิดพลาด 500 จากทาง DOPA (ระบบจะขอผลการตรวจสอบอีกครั้ง กรุณาติดตามผลในอีก 1 ชั่วโมง)'
    case 502:
      return 'ขณะนี้ระบบขัดข้อง รหัสข้อผิดพลาด 502 จาก DOPA (ระบบจะขอผลการตรวจสอบอีกครั้ง กรุณาติดตามผลในอีก 1 ชั่วโมง)'
    case 503:
      return 'เซิร์ฟเวอร์ไม่สามารถตอบสนองได้ชั่วคราว รหัสข้อผิดผลาด 503 จาก DOPA (ระบบจะขอผลการตรวจสอบอีกครั้ง กรุณาติดตามผลในอีก 1 ชั่วโมง)'
    case 504:
      return 'เซิร์ฟเวอร์ตอบกลับนานเกินกำหนด รหัสข้อผิดพลาด 504 จาก DOPA (ระบบจะขอผลการตรวจสอบอีกครั้ง กรุณาติดตามผลในอีก 1 ชั่วโมง)'
    default:
      return `${status}`
  }
}

const getDopaResponseMessage = (result: DopaResult) =>
  result?.response?.message ||
  result?.response?.data?.message ||
  result?.response?.data?.descField

const getDopaResultRemark = (result: DopaResult) =>
  result?.dopaRequestFailed
    ? getDopaRequestFailedRemarkByStatusCode(
        result.response?.statusCode ?? result.responseStatus
      )
    : getDopaResponseMessage(result)

const DopaDetail: FC<DopaDetailProps> = ({
  verification,
  showAttempts = false,
}) => {
  const { t } = useTranslation()

  const dopaResultsLength = useMemo(
    () => verification.dopaResults?.length ?? 0,
    [verification.dopaResults?.length]
  )

  const dopaResults = useMemo(
    () =>
      (verification?.dopaResults ?? [])
        ?.sort(sortByKey('updatedAt'))
        .slice(showAttempts ? 1 : 0, showAttempts ? undefined : 1),
    [showAttempts, verification?.dopaResults]
  )

  const getDopaData = useCallback(
    (dopa: DopaResult) => [
      {
        verificationDate:
          dopa?.updatedAt &&
          dateFormat(dopa?.updatedAt, dateFormats.dayMonthYear),
        verificationTime:
          dopa?.updatedAt && dateFormat(dopa?.updatedAt, dateFormats.isoTime),
        verificationResult: t(`generic.${getDopaStatus(dopa)}`),
        remark: getDopaResultRemark(dopa),
        isValid: !dopa?.verified,
      },
    ],
    [t]
  )

  return (
    <div>
      {dopaResults?.map((dopa, index) => {
        const Icon = dopaIcon[getDopaStatus(dopa)]
        return (
          <>
            <AttemptTitle
              errorTranslationPrefix="caseDetail.verification.attempt.dopa"
              count={dopaResultsLength - index - (showAttempts ? 1 : 0)}
              date={dopa.updatedAt}
            />
            <div className="mb-8 sm:mb-2">
              <div className="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-none items-center mb-6 sm:mb-0">
                <Icon
                  className={classNames(
                    'h-24 sm:h-36 w-full mb-6 my-3',
                    !dopa?.errors?.length && 'sm:col-span-2 row-span-2'
                  )}
                />
                {!!dopa?.errors?.length && (
                  <ErrorsBox errors={dopa?.errors} prefix="dopa" />
                )}
              </div>
              <div className="w-full overflow-x-auto">
                <Table
                  key="dopaTable"
                  tableClassName="min-w-[600px] lg:w-full"
                  theadClassName="rounded-lg"
                  tdClassName="px-0 py-2 sm:pb-4 sm:pt-4 sm:px-4 w-[25%]"
                  rowClassName="border-none"
                  data={getDopaData(dopa)}
                  tableSpecs={dopaSpace}
                />
              </div>
            </div>
          </>
        )
      })}
    </div>
  )
}

export default DopaDetail
