import { FC } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import SuccessIcon from 'assets/svg/status/success.svg?react'
import ErrorIcon from 'assets/svg/status/error.svg?react'

interface VerifyBadgeProps {
  className?: string
  iconClassName?: string
  verified?: boolean
  label?: string
  subTitle?: string
}

const baseIconClass = 'text-white rounded-full w-4 h-4'

const VerifyBadge: FC<VerifyBadgeProps> = ({
  className,
  iconClassName,
  verified,
  label,
  subTitle,
}) => {
  const { t } = useTranslation()

  if (typeof verified !== 'boolean')
    return (
      <div
        className={classNames('flex flex-row items-center gap-1', className)}
      >
        <p>{t(label ?? '-')}</p>
        {subTitle && (
          <p className="font-normal text-neutral text-xs sm:text-sm">
            {t(subTitle)}
          </p>
        )}
      </div>
    )

  return (
    <div className={classNames('flex flex-row items-center gap-1', className)}>
      {verified && (
        <SuccessIcon
          className={classNames(baseIconClass, 'bg-success', iconClassName)}
        />
      )}
      {!verified && (
        <ErrorIcon
          className={classNames(baseIconClass, 'bg-error', iconClassName)}
        />
      )}
      <span className={verified ? 'text-success' : 'text-error'}>
        <p>{t(label ?? '-')}</p>
        {subTitle && (
          <p className="font-normal text-neutral text-xs sm:text-sm">
            {t(subTitle)}
          </p>
        )}
      </span>
    </div>
  )
}

export default VerifyBadge
