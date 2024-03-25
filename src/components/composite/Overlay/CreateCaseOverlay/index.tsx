import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { overlayButtonAction } from 'actions'
import { useModal } from 'hooks/useModal'
import { FlowInput, CreateFlowFormValue } from 'types/caseKeeperCore'
import { WarningConfirmModal } from 'components/composite/Modal/WarningConfirmModal'
import { ValidatedImportSpreadsheet } from 'types/generic'
import { closeOverlay } from 'reducers'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { convertImportSpreadsheetToFlowInput } from 'utils/template'
import { CreateCaseTypeOverlay } from './CreateCaseTypeOverlay'
import { ChoosePositionOverlay } from './ChoosePositionOverlay'
import { CreateCaseFormOverlay } from './CreateCaseFormOverlay'
import { CreateCaseResultOverlay } from './CreateCaseResultOverlay'
import { CreateCaseProcess } from './types'
import { CreateCaseCsvOverlay } from './CreateCaseCsvOverlay'
import { ValidateTemplateTableOverlay } from './ValidateTemplateTableOverlay'

export const CreateCaseOverlay = () => {
  const modal = useModal()
  const dispatch = useDispatch()
  const { client } = useTenantConfigContext()

  const [flowInput, setFlowInput] = useState<FlowInput>()
  const [createProcess, setCreateProcess] = useState<CreateCaseProcess>(
    CreateCaseProcess.CHOOSE_TYPE
  )
  const [importData, setImportData] = useState<ValidatedImportSpreadsheet>()
  const formObject = useForm<CreateFlowFormValue>({
    defaultValues: {
      applicants: [],
    },
  })

  const { t } = useTranslation()

  const {
    CHOOSE_TYPE,
    CHOOSE_POSITION,
    INPUT_FORM,
    VERIFY_RESULT,
    IMPORT_FILE,
    VALIDATE_IMPORT_TEMPLATE,
  } = CreateCaseProcess

  const { reset, watch } = formObject
  const applicants = watch('applicants')

  const onClosePopup = () => {
    modal.renderElement(
      <WarningConfirmModal
        title={t('createCaseForm.modal.title')}
        subTitle={t('createCaseForm.modal.subTitle')}
        confirmButtonLabel={t('createCaseForm.modal.confirmButton')}
        cancelButtonLabel={t('createCaseForm.modal.cancelButton')}
        onCancel={() => modal.destroy()}
        onConfirm={() => {
          dispatch(overlayButtonAction({ confirmed: false }))
          dispatch(closeOverlay())
          modal.destroy()
        }}
      />
    )
  }

  const onSubmit = useCallback(
    (flowInputs: FlowInput[]) => {
      dispatch(
        overlayButtonAction({ confirmed: true, data: { inputs: flowInputs } })
      )
      dispatch(closeOverlay())
    },
    [dispatch]
  )

  switch (createProcess) {
    case CHOOSE_TYPE:
      return (
        <CreateCaseTypeOverlay
          onConfirm={setCreateProcess}
          onClosePopup={onClosePopup}
        />
      )
    case CHOOSE_POSITION:
      return (
        <ChoosePositionOverlay
          flowInput={flowInput}
          onChange={setFlowInput}
          onConfirm={() => setCreateProcess(INPUT_FORM)}
          onCancel={() => setCreateProcess(CHOOSE_TYPE)}
          onClosePopup={onClosePopup}
        />
      )
    case INPUT_FORM:
      return (
        <CreateCaseFormOverlay
          flowInput={flowInput}
          formObject={formObject}
          onConfirm={() => {
            setCreateProcess(VERIFY_RESULT)
          }}
          onCancel={() => {
            reset()
            setCreateProcess(CHOOSE_POSITION)
          }}
          onClosePopup={onClosePopup}
        />
      )
    case VERIFY_RESULT:
      return (
        <CreateCaseResultOverlay
          flowInput={flowInput}
          applicants={applicants}
          onCancel={() => setCreateProcess(INPUT_FORM)}
          onClosePopup={onClosePopup}
        />
      )
    case IMPORT_FILE:
      return (
        <CreateCaseCsvOverlay
          onClosePopup={onClosePopup}
          onSubmit={async (result) => {
            if (result.invalids.length > 0) {
              setImportData(result)
              setCreateProcess(VALIDATE_IMPORT_TEMPLATE)
              return
            }
            const flows = result.valids.map((r) =>
              convertImportSpreadsheetToFlowInput(r, client)
            )
            if (!flows?.length) return
            onSubmit(flows)
          }}
        />
      )
    case VALIDATE_IMPORT_TEMPLATE:
      return (
        <ValidateTemplateTableOverlay
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          validatedImportSpreadsheet={importData!}
          onCancel={() => setCreateProcess(IMPORT_FILE)}
          onSubmit={async (flows) => {
            if (!flows?.length) return
            onSubmit(flows)
          }}
          onClosePopup={onClosePopup}
        />
      )
    default:
      return null
  }
}
