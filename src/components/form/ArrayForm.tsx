import classNames from 'classnames'
import { useEffect, useCallback } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import AddIcon from 'assets/svg/icon-add.svg?react'
import RemoveIcon from 'assets/svg/icon-remove.svg?react'
import { FieldConfig, RendererFunc, UseRenderFormArgs } from 'types/generic'

export interface ArrayFormProps {
  renderer: RendererFunc
  name: string
  fields: FieldConfig[] | undefined
  hidden?: boolean
  control: UseRenderFormArgs['formObject']['control']
  fieldKey: string
  title?: string
  className?: string
  addButtonLabel?: string
  removeButtonLabel?: string
}

export const ArrayForm: React.FC<ArrayFormProps> = ({
  renderer,
  name,
  fields,
  hidden = false,
  control,
  title,
  fieldKey,
  className,
  addButtonLabel,
  removeButtonLabel,
}) => {
  const {
    fields: hookFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name,
  })
  const { t } = useTranslation()

  const appendField = useCallback(() => append({}), [append])

  useEffect(() => {
    if (!hookFields.length) appendField()
  }, [appendField, hookFields.length])

  return (
    <div
      className={classNames('flex-1 overflow-y-auto mb-4', hidden && 'hidden')}
    >
      {hookFields.map((field, index) => (
        <div className="pb-4 border-t first:border-none" key={field.id}>
          {index > 0 && (
            <div
              className={classNames(
                'flex justify-between items-center sticky top-0 bg-base-100 z-50',
                'mb-2 py-2'
              )}
            >
              <h2 className="font-semibold text-sm">
                {title ??
                  t(`createCaseForm.labels.${name}`, { count: index + 1 })}
              </h2>
              <button
                type="button"
                aria-label="Remove Icon"
                onClick={() => remove(index)}
                className="flex items-center btn-xs space-x-2"
              >
                <RemoveIcon className="w-3 h-3 mr-1" />
                {removeButtonLabel ?? t('generic.remove')}
              </button>
            </div>
          )}
          <div className={classNames('block', className)}>
            {renderer(fields, `${fieldKey}.${index}`)}
          </div>
        </div>
      ))}
      <button
        type="button"
        aria-label="Remove Icon"
        onClick={appendField}
        className="btn btn-outline btn-sm btn-primary font-light mx-1"
      >
        <AddIcon className="w-3 h-3" />
        {addButtonLabel ?? t('generic.add')}
      </button>
    </div>
  )
}
