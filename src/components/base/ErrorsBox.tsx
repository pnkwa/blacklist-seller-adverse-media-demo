import classNames from 'classnames'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ProcessErrorItem } from 'types/kycCore'

interface ErrorsBoxProps {
  errors: ProcessErrorItem[]
  className?: string
  prefix?: string
}

const ErrorsBox: FC<ErrorsBoxProps> = ({ errors, className, prefix }) => {
  const { t } = useTranslation()
  return (
    <div className={classNames('relative p-12', className)}>
      <div
        className={classNames(
          'absolute ml-4 mt-[-12px] p-2 rounded-lg bg-error text-white',
          'z-10'
        )}
      >
        {t('failedReasons.title')}
      </div>
      <ul className="list-disc py-8 bg-error/10 rounded-lg pl-10">
        {errors?.map((e) => (
          <li key={e.key}>
            {prefix ? t(`failedReasons.${prefix}.${e.key}`) : e.key}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ErrorsBox
