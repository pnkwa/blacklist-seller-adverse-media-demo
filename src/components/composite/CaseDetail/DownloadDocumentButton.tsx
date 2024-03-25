import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import { Flow } from 'types/caseKeeperCore'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import downloadZipIcon from 'assets/svg/icon-download-zip.svg?react'
import { useMessage } from 'hooks/message'
import { MessageType } from 'components/base/Message'
import { useDownloadZip } from 'hooks/useDownloadZip'
import { getZipFileName } from 'utils/flow'
import { ActionButton } from '../ActionButton'

interface DownloadDocumentButtonProps {
  flow: Flow
}

export const DownloadDocumentButton: React.FC<DownloadDocumentButtonProps> = ({
  flow,
}) => {
  const { t } = useTranslation()
  const message = useMessage()
  const onDownloadZip = useDownloadZip()
  const { downloadZip } = useCaseKeeperContext()

  const [loadingZip, setLoadingZip] = useState(false)

  const onCRSSHDownloadZip = useCallback(() => {
    if (!flow.backgroundCheck) return
    setLoadingZip(true)
    if (
      flow.backgroundCheck?.criminalRecord?.resultDocumentKey ??
      flow.backgroundCheck?.socialSecurityHistory?.resultDocumentKey
    ) {
      onDownloadZip({ flows: [flow] })
      setLoadingZip(false)
    } else {
      downloadZip(flow.id, getZipFileName(flow))
        .catch(() =>
          message.render({
            type: MessageType.DownloadError,
            text: t('caseDetail.downloadZip.error.title'),
            textClassName: 'font-bold',
            detail: t('caseDetail.downloadZip.error.detail'),
            detailClassName: 'font-bold',
            onClose: () => message.destroy(),
          })
        )
        .finally(() => setLoadingZip(false))
    }
  }, [flow, onDownloadZip, downloadZip, message, t])

  return (
    <ActionButton
      key="downloadZip"
      text={t('caseDetail.downloadZip.title')}
      svgIcon={downloadZipIcon}
      onClick={onCRSSHDownloadZip}
      loading={loadingZip}
      disabled={loadingZip}
    />
  )
}
