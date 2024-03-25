import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EmptyDataImg from 'assets/svg/empty-data-placeholder.svg?react'

interface DetailPlaceholderProps {
  icon: React.ReactNode
  text: string
  className?: string
  children?: React.ReactNode
}

const DetailPlaceholder = ({
  icon,
  text,
  className,
  children,
}: DetailPlaceholderProps) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames(
        'w-full h-full flex flex-col items-center justify-center',
        'text-center text-base-content font-medium text-sm',
        className
      )}
    >
      {icon}
      <div className="mt-4">{t(text)}</div>
      {children}
    </div>
  )
}

interface PlaceholderProps {
  text?: string
  className?: string
  children?: React.ReactNode
}

export const NoCasesPlaceholder = ({
  text,
  className,
  children,
}: PlaceholderProps) => (
  <DetailPlaceholder
    icon={<EmptyDataImg />}
    text={text ?? 'generic.noData'}
    className={className}
  >
    {children}
  </DetailPlaceholder>
)

export const ErrorPlaceholder: React.FC<PlaceholderProps> = ({
  text,
  className,
}) => (
  <DetailPlaceholder
    icon={<FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl" />}
    text={text ?? 'generic.error'}
    className={className}
  />
)
