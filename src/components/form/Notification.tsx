import classNames from 'classnames'
import { FieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ValidationType } from 'types/generic'
import { NotifyType } from 'types/kycCore'
import { path } from 'utils/common'
import { getValidations } from 'utils/form'
import { InputSingle, InputType } from './Input'

const options = [
  {
    radio: {
      value: NotifyType.SMS,
      label: 'createCaseForm.labels.phoneNumber',
      key: 'notifyType',
    },
    input: {
      value: InputType.NUMBER,
      key: 'phoneNumber',
      placeholder: 'createCaseForm.placeholders.phoneNumber',
      validation: [],
    },
  },
  {
    radio: {
      value: NotifyType.EMAIL,
      label: 'createCaseForm.labels.email',
      key: 'notifyType',
    },
    input: {
      type: InputType.EMAIL,
      key: 'email',
      placeholder: 'createCaseForm.placeholders.email',
      validation: [],
    },
  },
]

const handleNumberInput = (e) => !/[0-9]/.test(e.key) && e.preventDefault()

export const Notification = ({
  col,
  register,
  watch,
  fieldKey,
  errors,
  clearErrors,
}) => {
  const notifyValue = watch(`${fieldKey}.notifyType`) || NotifyType.SMS

  const { t } = useTranslation()
  const onClickType = () => {
    clearErrors(`${fieldKey}.email`)
    clearErrors(`${fieldKey}.phoneNumber`)
  }

  return (
    <div
      className={classNames(
        'space-y-2 pt-4',
        col ? `col-span-${col}` : 'col-span-12'
      )}
    >
      <p className="text-sm font-semibold">
        {t('createCaseForm.labels.contract')}
      </p>
      {options.map((item, idx) => {
        let validation: ValidationType[] = []
        if (item.input.key === 'phoneNumber' && notifyValue === NotifyType.SMS)
          validation = [ValidationType.REQUIRED, ValidationType.PHONE_NUMBER]
        if (item.input.key === 'email' && notifyValue === NotifyType.EMAIL)
          validation = [ValidationType.REQUIRED, ValidationType.EMAIL]
        const error: FieldError | undefined = path(
          [...fieldKey.split('.'), item.input.key],
          errors
        )
        return (
          <div className="flex flex-col gap-y-1" key={idx}>
            <div className="xs+:min-w-36 flex items-center">
              <div className="w-6">
                <input
                  type="radio"
                  value={item.radio.value}
                  key={idx}
                  className="radio w-4 h-4 radio-xs radio-primary align-middle"
                  {...register(`${fieldKey}.${item.radio.key}`, {
                    value: options[0].radio.value,
                  })}
                  onClick={onClickType}
                />
              </div>
              <div
                className={classNames(
                  'capitalize text-xs align-middle',
                  'text-base-content'
                )}
              >
                {t(item.radio.label)}
              </div>
            </div>
            <div className="w-full pl-6">
              <InputSingle
                type={item.input.type}
                register={register(`${fieldKey}.${item.input.key}`, {
                  validate: getValidations(validation),
                })}
                onKeyPress={
                  item.input.key === 'phoneNumber'
                    ? handleNumberInput
                    : () => {}
                }
                hidden={notifyValue !== item.radio.value}
                placeholder={t(item.input.placeholder)}
                error={error}
              />
            </div>
            {error && (
              <div className="py-1 pb-0 block text-right text-xs">
                <span className="label-text-alt text-error">
                  {error?.message ?? error?.type}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
