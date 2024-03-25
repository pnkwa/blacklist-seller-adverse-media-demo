import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import {
  FieldConfig,
  FieldType,
  ImportSpreadsheet,
  ValidatedImportSpreadsheet,
} from 'types/generic'
import { getAllCreateLinkFormFields } from 'utils/form'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import {
  checkValidSpreadsheetFields,
  convertImportSpreadsheetToFlowInput,
} from 'utils/template'
import TrashIcon from 'assets/svg/trash-icon.svg?react'
import { FlowInput } from 'types/caseKeeperCore'
import { useModal } from 'hooks/useModal'
import { InputSelect } from 'components/form/InputSelect'
import { getDropDownValues } from 'masterdata'
import { Client } from 'types/tenantConfig'
import { getMasterdataTranslation } from 'utils/translations'
import { joinStringsWithJoiner } from 'utils/common'
import { Dialog } from '../../Dialog'

interface DeleteButtonProps {
  onDelete?: () => void
}
const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => (
  <button
    type="button"
    className="btn btn-sm bg-base-100 w-10"
    aria-label="delete"
    onClick={onDelete}
  >
    <TrashIcon className="w-4 h-4" />
  </button>
)

interface InputFieldProps {
  field?: FieldConfig
  fieldKey: string
  isValid?: boolean
  isMutable?: boolean
  onChange?: (val: string | object) => void
  onDelete?: () => void
  client: Client
  control
  watch
}
const InputField: React.FC<InputFieldProps> = ({
  isValid,
  isMutable,
  field,
  fieldKey,
  onChange,
  onDelete,
  client,
  control,
  watch,
}) => {
  const isDropdown = useMemo(
    () => field?.type === FieldType.DROPDOWN,
    [field?.type]
  )
  const getDisplayValue = useCallback(
    (key) => {
      const val = watch(key)
      if (typeof val === 'object') return getMasterdataTranslation(val)
      if (isMutable) return val || ''
      return val || '-'
    },
    [isMutable, watch]
  )

  if (field?.key === 'delete') return <DeleteButton onDelete={onDelete} />

  if (!isValid && isDropdown) {
    return (
      <InputSelect
        name={fieldKey}
        onChange={(e) => onChange?.(e)}
        control={control}
        className="w-28"
        options={
          field?.optionsSource
            ? getDropDownValues(field?.optionsSource, field.display, client)
            : field?.options
        }
      />
    )
  }

  return (
    <input
      className={classNames(
        'input rounded-lg input-md text-xs',
        isMutable ? 'input-error' : 'border-none pointer-events-none'
      )}
      value={getDisplayValue(fieldKey)}
      defaultValue={getDisplayValue(fieldKey)}
      type="text"
      onChange={(e) => onChange?.(e.target.value)}
      tabIndex={isMutable ? 0 : -1}
    />
  )
}

interface ValidateTemplateTableOverlayProps {
  validatedImportSpreadsheet: ValidatedImportSpreadsheet
  onCancel: () => void
  onSubmit: (flowInputs?: FlowInput[]) => void
  onClosePopup: () => void
}
export const ValidateTemplateTableOverlay: React.FC<
  ValidateTemplateTableOverlayProps
> = ({ validatedImportSpreadsheet, onCancel, onClosePopup, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)
  const { client } = useTenantConfigContext()
  const { t } = useTranslation()
  const { setValue, handleSubmit, watch, trigger, control } = useForm()
  const modal = useModal()

  const createLinkFormFields = useMemo(
    () => [
      ...getAllCreateLinkFormFields(client),
      { key: 'delete', type: FieldType.CHECK_BOX },
    ],
    [client]
  )

  const getAllErrors = useCallback(() => {
    const allErrors = Object.values(watch())
      ?.filter((invalid) => !!invalid?.errors)
      .flatMap((i) => i.errors.map(({ key }) => key))
    setErrors([...new Set(allErrors)])
  }, [watch])

  const getFieldText = useCallback(
    (key: string) => t(`createCaseCsv.fields.${key}`),
    [t]
  )

  const initialErrors = useMemo(
    () => [
      ...new Set(
        validatedImportSpreadsheet.invalids
          .filter((invalid) => !!invalid.errors)
          .flatMap((i) => i.errors.map(({ key }) => key))
      ),
    ],
    [validatedImportSpreadsheet.invalids]
  )
  const errorText = useMemo(
    () =>
      [
        joinStringsWithJoiner(
          initialErrors,
          ` ${t('generic.and')} `,
          (str: string) => getFieldText(str)
        ),
        t('createCaseCsv.validate.isIncorrect'),
      ].join(''),
    [getFieldText, initialErrors, t]
  )

  const handleSubmitData = useCallback(
    async (data: Record<string, ImportSpreadsheet>) => {
      const flows = [
        ...validatedImportSpreadsheet.valids,
        ...(Object.values(data).filter((v) => !!v) as ImportSpreadsheet[]),
      ].map((r) => convertImportSpreadsheetToFlowInput(r, client))
      setLoading(true)
      onSubmit(flows)
    },
    [client, onSubmit, validatedImportSpreadsheet]
  )

  const initialFormLoad = useCallback(() => {
    validatedImportSpreadsheet.invalids.forEach((d, index) => {
      const validation = checkValidSpreadsheetFields(d, client)
      const errors = validation === true ? undefined : validation
      const errorKeys = Array.isArray(errors) ? errors.map((e) => e.key) : []
      createLinkFormFields.forEach(({ key }) =>
        setValue(`${index}.${key}`, errorKeys.includes(key) ? '' : d?.[key])
      )
      setValue(`${index}.errors`, errors)
      getAllErrors()
    })
  }, [
    client,
    createLinkFormFields,
    getAllErrors,
    setValue,
    validatedImportSpreadsheet.invalids,
  ])

  useEffect(() => {
    if (initialized) return
    initialFormLoad()
    getAllErrors()
    setInitialized(true)
  }, [getAllErrors, initialFormLoad, initialized])

  const onChange = useCallback(
    (field, res, idx) => {
      const newRecord = {
        ...watch(`${idx}`),
        [field.key]: res,
      }
      const validation = checkValidSpreadsheetFields(newRecord, client)
      const errors = validation === true ? undefined : validation

      setValue(`${idx}.${field.key}`, res)
      setValue(`${idx}.errors`, errors)
      getAllErrors()
      trigger()
    },
    [client, getAllErrors, setValue, trigger, watch]
  )

  const onDelete = useCallback(
    (idx) => {
      modal.render({
        onConfirm: () => {
          setValue(`${idx}`, undefined)
          getAllErrors()
        },
        onCancel: modal.destroy,
        content: (
          <Dialog
            title={t('createCaseCsv.validate.delete')}
            confirmButtonLabel={t('generic.delete')}
            className="shadow-none"
          />
        ),
      })
    },
    [getAllErrors, modal, setValue, t]
  )

  const getValidationValue = useCallback(
    (key: string) => {
      const param = { fieldName: getFieldText(key) }
      const required = t('createCaseCsv.validations.required', param)
      const invalid = t('createCaseCsv.validations.invalid', param)
      const isError = errors.includes(key)
      const hasValue = validatedImportSpreadsheet.invalids.every((v) => v[key])
      if (!isError) return null
      return hasValue ? invalid : required
    },
    [errors, getFieldText, t, validatedImportSpreadsheet.invalids]
  )

  return (
    <Dialog
      className="w-full h-full !mx-16 max-w-5xl"
      btnWrapperClass="justify-end"
      confirmBtnClass="flex-none w-1/4"
      cancelBtnClass="flex-none w-1/4"
      title={t('createCaseCsv.validate.title')}
      childClass="overflow-hidden"
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClosePopup} />}
      onConfirm={handleSubmit(handleSubmitData)}
      onCancel={onCancel}
      confirmButtonLabel={t('generic.continue')}
      isConfirmButtonDisabled={errors && errors?.length > 0}
      isConfirmButtonLoading={loading}
    >
      <div
        className={classNames(
          'flex items-center space-x-4 p-4 bg-error/10 border border-error',
          'rounded-xl mb-2'
        )}
      >
        <FontAwesomeIcon icon={faWarning} className="h-5 text-error" />
        <div className="text-sm text-error">
          <p className="font-bold">
            {t('createCaseCsv.validate.description', {
              count: validatedImportSpreadsheet.invalids.length,
            })}
          </p>
          <p className="font-light">{errorText}</p>
        </div>
      </div>
      <div className="space-y-4 overflow-auto h-full w-full">
        <div className="w-full h-full overflow-auto">
          <table className="table text-sm text-base-content text-left">
            <thead>
              <tr
                className={classNames(
                  'z-[2] border-none',
                  "after:content-[''] after:absolute after:h-[1px] after:inset-x-0 after:bg-base-200 after:bottom-0"
                )}
              >
                {createLinkFormFields.map((field) => (
                  <th
                    key={`validate-import-table-header-${field.key}`}
                    className={classNames(
                      'text-left font-normal p-4 bg-base-200/50 relative',
                      "after:content-[''] after:absolute after:w-[1px] after:inset-y-3 after:bg-base-300 after:right-0 last:after:hidden"
                    )}
                  >
                    {t(`createCaseCsv.fields.${field.key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {errors.length > 0 ? (
                  createLinkFormFields.map((clff) => (
                    <td
                      className="text-error text-2xs font-medium h-5"
                      key={`import-validate-error-${clff.key}`}
                    >
                      {getValidationValue(clff.key)}
                    </td>
                  ))
                ) : (
                  // eslint-disable-next-line jsx-a11y/control-has-associated-label
                  <td className="h-5" />
                )}
              </tr>
              {Object.values(watch() || {})?.map(
                (record, index) =>
                  record && (
                    <tr key={`validate-import-table-${index}`}>
                      {createLinkFormFields.map((clff) => (
                        <td
                          className={classNames(
                            'mr-auto',
                            index === 0 && errors.length ? 'p-1' : 'p-1'
                          )}
                          aria-label={`import-table-${index}-${clff.key}`}
                          key={`import-table-${index}-${clff.key}`}
                        >
                          <InputField
                            isValid={
                              !watch(`${index}.errors`) ||
                              !watch(`${index}.errors`)?.find(({ key }) =>
                                key.includes(clff.key)
                              )
                            }
                            isMutable={record?.errors
                              ?.map(({ key }) => key)
                              .includes(clff.key)}
                            fieldKey={`${index}.${clff.key}`}
                            field={clff}
                            control={control}
                            onDelete={() => onDelete(index)}
                            onChange={(res) => onChange(clff, res, index)}
                            client={client}
                            watch={watch}
                          />
                        </td>
                      ))}
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Dialog>
  )
}
