import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

interface ResultProps {
  title: string
  subTitle?: string
  faIcon?: IconDefinition
  iconClass?: string
  children?: React.ReactNode
}

export const Result = ({
  title,
  subTitle,
  faIcon,
  iconClass,
  children,
}: ResultProps) => {
  return (
    <div className="p-4 space-x-4 text-base-content flex items-center">
      {faIcon && (
        <FontAwesomeIcon
          icon={faIcon}
          size="4x"
          className={classNames('text-error', iconClass)}
        />
      )}
      <div>
        <h4 className="font-black text-2xl">{title}</h4>
        {subTitle && <p className="opacity-40">{subTitle}</p>}
        {children}
      </div>
    </div>
  )
}
