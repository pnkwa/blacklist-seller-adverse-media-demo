import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { t } from 'i18next'
import { BulkDownloadPopup } from 'components/composite/BulkDownloadPopup'
import { closeOverlay, openOverlay } from 'reducers'
import { OverlayType } from 'types/generic'
import { logger } from 'utils/logger'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { useModal } from 'hooks/useModal'
import { CRSSHResultPasswordOverlay } from 'components/composite/Overlay/CRSSHResultPasswordOverlay'
import { Flow } from 'types/caseKeeperCore'
import { MessageType } from 'components/base/Message'
import { getZipFileName } from 'utils/flow'
import { useMessage } from './message'

interface OnDownloadZipProps {
  flows: Flow[]
  onClear?: () => void
}

export const useDownloadZip = () => {
  const modal = useModal()
  const message = useMessage()
  const dispatch = useDispatch()
  const { downloadZip, bulkDownloadZip } = useCaseKeeperContext()

  const onCloseModal = useCallback(() => {
    modal.destroy()
  }, [modal])

  const bulkDownload = useCallback(
    async (flowIds: string[], password?: string) =>
      bulkDownloadZip(flowIds, password)
        .then(() => {
          modal.renderElement(
            <BulkDownloadPopup success onConfirm={modal.destroy} />
          )
        })
        .catch(() =>
          modal.renderElement(<BulkDownloadPopup onConfirm={modal.destroy} />)
        ),
    [bulkDownloadZip, modal]
  )

  const onDownloadZip = useCallback(
    async ({ flows, onClear }: OnDownloadZipProps) => {
      try {
        const requirePassword = flows.some(
          (flow) =>
            flow.backgroundCheck?.criminalRecord?.resultDocumentKey ??
            flow.backgroundCheck?.socialSecurityHistory?.resultDocumentKey
        )

        const flowIds: string[] = flows.map((flow) => flow.id)

        if (requirePassword) {
          modal.renderElement(
            <CRSSHResultPasswordOverlay
              onCloseModal={onCloseModal}
              flows={flows}
              onPopupConfirm={async (password) => {
                if (flows.length === 1) {
                  const [flow] = flows
                  if (!flow?.backgroundCheck) return
                  const fileName = getZipFileName(flow)
                  onClear?.()
                  modal.destroy()
                  dispatch(openOverlay({ type: OverlayType.LOADING }))
                  await downloadZip(flow.id, fileName, {
                    password,
                  }).catch(() =>
                    message.render({
                      type: MessageType.DownloadError,
                      text: t('caseDetail.downloadZip.error.title'),
                      textClassName: 'font-bold',
                      detail: t('caseDetail.downloadZip.error.detail'),
                      detailClassName: 'font-bold',
                      onClose: message.destroy,
                    })
                  )
                  dispatch(closeOverlay())
                  return
                }
                onClear?.()
                await bulkDownload(flowIds, password)
              }}
            />
          )
          return
        }
        if (flows.length === 1) {
          const [flow] = flows
          if (!flow?.backgroundCheck) return
          const fileName = getZipFileName(flow)
          onClear?.()
          dispatch(openOverlay({ type: OverlayType.LOADING }))
          await downloadZip(flow.id, fileName).catch(() =>
            message.render({
              type: MessageType.DownloadError,
              text: t('caseDetail.downloadZip.error.title'),
              textClassName: 'font-bold',
              detail: t('caseDetail.downloadZip.error.detail'),
              detailClassName: 'font-bold',
              onClose: message.destroy,
            })
          )
          dispatch(closeOverlay())
          return
        }
        onClear?.()
        await bulkDownload(flowIds)
      } catch (error) {
        logger.error(error)
      }
    },
    [bulkDownload, dispatch, downloadZip, message, modal, onCloseModal]
  )
  return onDownloadZip
}
