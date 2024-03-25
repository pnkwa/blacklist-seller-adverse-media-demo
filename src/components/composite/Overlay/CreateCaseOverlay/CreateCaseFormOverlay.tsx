import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormReturn } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { getMasterData } from 'masterdata'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { useRenderForm } from 'hooks/rendererForm'
import { ArrayForm } from 'components/form/ArrayForm'
import { ConfirmCancelButton } from 'components/composite/ConfirmCancelButton'
import { Dialog } from 'components/composite/Dialog'
import { FieldConfig } from 'types/generic'
import { Applicant, FlowInput } from 'types/caseKeeperCore'

interface CreateCaseFormOverlayProps {
  flowInput?: FlowInput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formObject: UseFormReturn<any, any>
  onConfirm: () => void
  onCancel: () => void
  onClosePopup: () => void
}

export const CreateCaseFormOverlay: React.FC<CreateCaseFormOverlayProps> = ({
  flowInput,
  formObject,
  onConfirm,
  onCancel,
  onClosePopup,
}) => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()

  const { reset, control, handleSubmit } = formObject

  const templates = getMasterData('createLinkForms', client)

  const fields: FieldConfig[] = useMemo(() => {
    if (!flowInput?.formKey) return []
    const fields: FieldConfig[] = templates[flowInput?.formKey]?.fields
    return fields.map(({ requiredProcess, ...rest }) => {
      if (
        requiredProcess &&
        !flowInput?.backgroundCheck?.processConfigs?.[requiredProcess]
      )
        return {
          ...rest,
          hidden: true,
          validation: [],
        }
      return rest
    })
  }, [flowInput, templates])

  const onSubmit = useCallback(
    async (data: { applicants: Applicant[] }) => {
      const { applicants } = data
      if (!applicants.length) return
      reset({ applicants })
      onConfirm()
    },
    [onConfirm, reset]
  )

  const { renderer } = useRenderForm({
    formObject,
    getLabel: (item) => `createCaseForm.labels.${item.key}`,
    getPlaceholder: (item) => `createCaseForm.placeholders.${item.key}`,
  })

  if (!flowInput) return null

  return (
    <Dialog
      title={t('createCaseForm.title')}
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClosePopup} />}
      message={t('createCaseForm.inputForm')}
      className="h-full w-full max-w-xl text-base-content"
      messageClass="text-sm font-light"
      childClass="overflow-y-auto"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <ArrayForm
          name="applicants"
          fieldKey="applicants"
          className="grid grid-cols-12 sm:gap-x-4 gap-x-2 sm:gap-4 gap-2 px-1"
          addButtonLabel={t('createCaseForm.form.add')}
          removeButtonLabel={t('createCaseForm.form.remove')}
          control={control}
          renderer={renderer}
          fields={fields}
        />
        <ConfirmCancelButton
          className="p-1 pt-2"
          confirmButtonLabel={t('generic.next')}
          cancelButtonLabel={t('generic.back')}
          onConfirm={handleSubmit(onSubmit)}
          isConfirmButtonDisabled={!flowInput}
          onCancel={onCancel}
        />
      </form>
    </Dialog>
  )
}
