import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ArrayForm, ArrayFormProps } from './ArrayForm'

interface ObjectFormProps extends ArrayFormProps {
  array?: boolean
  hideLabel?: boolean
}

export const ObjectForm: React.FC<ObjectFormProps> = ({
  array,
  hideLabel,
  ...rest
}) => {
  const { t } = useTranslation()

  if (array) return <ArrayForm {...rest} />

  const { renderer, hidden, name, fields, fieldKey } = rest

  return (
    <div className={classNames(!hideLabel && 'pb-2', hidden && 'hidden')}>
      {!hideLabel && (
        <h2 className="font-semibold text-sm mb-2">
          {t(`createCaseForm.labels.${name}`)}
        </h2>
      )}
      <div className="space-y-2">{renderer(fields, fieldKey)}</div>
    </div>
  )
}
