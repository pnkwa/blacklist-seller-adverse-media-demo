import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface FieldProps {
  title: string
  className?: string
  children?: ReactNode
}

export const Field: FC<FieldProps> = ({ title, children, className }) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames(
        'flex flex-col w-full gap-2',
        'lg:flex-row text-left',
        className
      )}
    >
      <div className="flex font-bold w-[200px]">{t(title)}</div>
      <div className="w-full">{children}</div>
    </div>
  )
}
