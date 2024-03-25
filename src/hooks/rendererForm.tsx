import { useTranslation } from 'react-i18next'
import { ObjectForm } from 'components/form/ObjectForm'
import { Input, InputType } from 'components/form/Input'
import { Checkbox } from 'components/form/Checkbox'
import { Notification } from 'components/form/Notification'
import { DateDropdown } from 'components/form/DateDropdown'
import { Radio } from 'components/form/Radio'
import {
  FieldType,
  RendererFunc,
  UseRenderFormArgs,
  ValidationType,
} from 'types/generic'
import { getValidations } from 'utils/form'
import { path } from 'utils/common'
import { logger } from 'utils/logger'
import { getDropDownValues } from 'masterdata/getMasterdata'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { InputSelect } from 'components/form/InputSelect'

export const useRenderForm = (args: UseRenderFormArgs) => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()

  const {
    formObject,
    isDisabled,
    getLabel = (item) => t(item.label ?? ''),
    getPlaceholder = (item) => t(item.placeholder ?? ''),
  } = args

  const {
    clearErrors,
    control,
    formState: { errors },
    register,
    setValue,
    watch,
  } = formObject

  const renderer: RendererFunc = (fields, parentFieldKey = '') => {
    if (!fields?.length) return null
    try {
      return fields.map((item, index) => {
        const {
          array,
          autoComplete,
          display,
          fields,
          hidden,
          key,
          label,
          multiple,
          options,
          optionsSource,
          pagination,
          placeholder,
          templates,
          tip,
          title,
          translatePrefix,
          type = FieldType.TEXT,
          validation = [],
          value,
          autoFocus,
          autoEkyc,
          transferFields,
          hideLabel,
          displayKey,
          col,
          ...rest
        } = item
        const fieldKey = `${parentFieldKey ? `${parentFieldKey}.` : ''}${key}`
        const required = validation.includes(ValidationType.REQUIRED)

        const fieldValue = watch(fieldKey)

        const translatedLabel = t(
          getLabel({ ...item, key: displayKey ?? item.key }) ?? ''
        )
        const translatedPlaceholder = t(
          getPlaceholder({ ...item, key: displayKey ?? item.key }) ?? ''
        )

        switch (type) {
          case FieldType.TEXT:
          case FieldType.NUMBER:
          case FieldType.PASSWORD:
          case FieldType.CURRENCY:
            return (
              <Input
                autoComplete={autoComplete}
                type={type as unknown as InputType}
                register={register(fieldKey, {
                  validate: getValidations(validation, watch),
                  value,
                })}
                label={translatedLabel}
                placeholder={translatedPlaceholder}
                autoFocus={autoFocus}
                error={path(fieldKey.split('.'), errors)}
                required={required}
                key={fieldKey}
                hidden={hidden}
                disabled={isDisabled}
                setValue={setValue}
                col={col}
                defaultValue={fieldValue}
                {...rest}
              />
            )
          case FieldType.CHECK_BOX:
            return (
              <Checkbox
                key={`${fieldKey}.${index}`}
                register={register(fieldKey, {
                  value,
                })}
                label={translatedLabel}
                className="checkbox-primary"
                disabled={isDisabled}
              />
            )
          case FieldType.RADIO:
            return (
              <Radio
                key={`${fieldKey}.${index}`}
                fieldKey={`${fieldKey}.${index}`}
                register={register(fieldKey, { value })}
                label={translatedLabel}
                className="checkbox-primary"
                options={options as string[]}
                value={value}
                disabled={isDisabled}
                translatePrefix={translatePrefix}
              />
            )
          case FieldType.DROPDOWN: {
            return (
              <InputSelect
                control={control}
                col={col}
                isMulti={multiple}
                tip={tip && t(tip)}
                error={path(fieldKey.split('.'), errors)}
                name={fieldKey}
                key={`${fieldKey}.${index}`}
                validation={getValidations(validation)}
                label={translatedLabel}
                placeholder={translatedPlaceholder}
                options={
                  optionsSource
                    ? getDropDownValues(optionsSource, display, client)
                    : options
                }
              />
            )
          }
          case FieldType.DATE:
            return (
              <DateDropdown
                control={control}
                error={path(fieldKey.split('.'), errors)}
                fieldKey={fieldKey}
                key={`${fieldKey}.${index}`}
                validation={getValidations(validation)}
                value={fieldValue}
                label={translatedLabel}
              />
            )
          case FieldType.OBJECT:
            return (
              <ObjectForm
                fieldKey={fieldKey}
                fields={fields}
                name={key}
                key={`${fieldKey}.${index}`}
                renderer={renderer}
                hidden={hidden}
                control={control}
                array={array}
                title={title}
                hideLabel={hideLabel}
              />
            )
          case FieldType.NOTIFICATION:
            return (
              <Notification
                key={`${fieldKey}.${index}`}
                col={col}
                fieldKey={parentFieldKey ?? fieldKey}
                register={register}
                watch={watch}
                errors={errors}
                clearErrors={clearErrors}
              />
            )
          case FieldType.RAW:
            return (
              <input
                key={fieldKey}
                className="hidden"
                {...register(fieldKey, { value })}
              />
            )
          default:
            return null
        }
      })
    } catch (error) {
      logger.error(error)
    }
    return null
  }

  return { renderer }
}
