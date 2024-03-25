import { useTranslation } from 'react-i18next'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FieldConfig, FieldType, ValidationType } from 'types/generic'
import { useRenderForm } from 'hooks/rendererForm'
import { Flow } from 'types/caseKeeperCore'
import { Dialog } from '../Dialog'
import { ConfirmCancelButton } from '../ConfirmCancelButton'
import { Modal } from '../Modal'

const fieldConfig: FieldConfig[] = [
  {
    key: 'password',
    type: FieldType.PASSWORD,
    autoComplete: 'pdf-password',
    autoFocus: true,
    validation: [ValidationType.REQUIRED, ValidationType.PDF_PASSWORD],
  },
]

interface CRSSHResultPasswordOverlayProps {
  onPopupConfirm: (password: string) => Promise<void>
  flows: Flow[]
  onCloseModal
}

enum ProcessKey {
  CRSSH = 'CRSSH',
  CR = 'CR',
  SSH = 'SSH',
}

export const CRSSHResultPasswordOverlay: React.FC<
  CRSSHResultPasswordOverlayProps
> = ({ onPopupConfirm, flows, onCloseModal }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const formObject = useForm({})
  const { handleSubmit } = formObject

  const { renderer } = useRenderForm({ formObject })

  const renderFields = useMemo(() => renderer(fieldConfig), [renderer])

  const onConfirm = useCallback(
    async (data) => {
      setLoading(true)

      onPopupConfirm(data.password)

      setLoading(false)
    },
    [onPopupConfirm]
  )
  const getProcessName = useMemo(() => {
    const hasCR = flows.some(
      (flow) => flow.backgroundCheck?.criminalRecord?.resultDocumentKey
    )
    const hasSSH = flows.some(
      (flow) => flow.backgroundCheck?.socialSecurityHistory?.resultDocumentKey
    )
    if (hasCR && hasSSH) return ProcessKey.CRSSH
    if (hasCR) return ProcessKey.CR
    return ProcessKey.SSH
  }, [flows])

  return (
    <Modal modalClass="!p-0">
      <Dialog
        title={t(
          `caseDetail.CRSSHResultPasswordOverlay.title.${getProcessName}`
        )}
        message={t('caseDetail.CRSSHResultPasswordOverlay.subTitle')}
        className="max-w-lg shadow-none"
      >
        <form className="flex flex-col">
          {renderFields}
          <div className="flex flex-1 justify-end pt-5">
            <ConfirmCancelButton
              confirmLoading={loading}
              onConfirm={handleSubmit(onConfirm)}
              onCancel={onCloseModal}
            />
          </div>
        </form>
      </Dialog>
    </Modal>
  )
}
