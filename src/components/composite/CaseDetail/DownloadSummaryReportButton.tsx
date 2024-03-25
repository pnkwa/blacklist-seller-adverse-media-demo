import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useCallback, useMemo, useState } from 'react'
import { Flow } from 'types/caseKeeperCore'
import { useMessage } from 'hooks/message'
import { useLead } from 'hooks/useLead'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { MessageType } from 'components/base/Message'
import DownloadIcon from 'assets/svg/icon-paper-download.svg?react'
import DiamondBadgeIcon from 'assets/svg/icon-diamond.svg?react'
import { downloadFile } from 'utils/download'
import { dateFormats } from 'config/dateFormats'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { logger } from 'utils/logger'
import { ActionButton } from '../ActionButton'

interface DownloadSummaryReportButtonProps {
  flow: Flow
}

export const DownloadSummaryReportButton: React.FC<
  DownloadSummaryReportButtonProps
> = ({ flow }) => {
  const { t } = useTranslation()
  const message = useMessage()
  const { downloadSummaryReport } = useCaseKeeperContext()
  const {
    client: { backgroundCheckDashboardConfig },
  } = useTenantConfigContext()
  const { bgcSummaryReportLanguages } = backgroundCheckDashboardConfig ?? {}
  const { onFindAndShowLead } = useLead()

  const [loading, setLoading] = useState(false)

  const isEnable = useMemo(
    () => !!bgcSummaryReportLanguages?.length,
    [bgcSummaryReportLanguages?.length]
  )

  const onDownloadSummaryReport = useCallback(async () => {
    if (!flow.backgroundCheck) return
    setLoading(true)

    if (!bgcSummaryReportLanguages?.length) return

    const useLang =
      bgcSummaryReportLanguages.length > 1
        ? ''
        : `_(${bgcSummaryReportLanguages[0].toUpperCase()})`

    const name =
      flow.backgroundCheck.verificationInfo.firstNameEN ??
      flow.backgroundCheck.verificationInfo.firstNameTH

    downloadSummaryReport(flow.id)
      .then((res) =>
        downloadFile(
          res,
          `${moment().format(
            dateFormats.compactISODate
          )}_Summary_Report_${name}${useLang}.pdf`,
          'application/pdf'
        )
      )
      .catch((err) => {
        logger.error(err)
        message.render({
          type: MessageType.DownloadError,
          text: t('caseDetail.downloadZip.error.title'),
          textClassName: 'font-bold',
          detail: t('caseDetail.downloadZip.error.detail'),
          detailClassName: 'font-bold',
          onClose: () => message.destroy(),
        })
      })
      .finally(() => setLoading(false))
  }, [
    bgcSummaryReportLanguages,
    downloadSummaryReport,
    flow.backgroundCheck,
    flow.id,
    message,
    t,
  ])

  const onLead = useCallback(
    () => onFindAndShowLead('summaryReport'),
    [onFindAndShowLead]
  )

  return (
    <ActionButton
      key="downloadSummaryReport"
      text={t('caseDetail.summaryReportButton.title')}
      svgIcon={!isEnable ? DiamondBadgeIcon : DownloadIcon}
      iconClassName="ml-[-5px] !h-6 !w-6"
      onClick={isEnable ? onDownloadSummaryReport : onLead}
      loading={loading}
    />
  )
}
