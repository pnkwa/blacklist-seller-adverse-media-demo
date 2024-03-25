import { FC } from 'react'
import classNames from 'classnames'
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface HamburgerMenuButtonProps {
  className?: string
  isExpanded: boolean
  onClick: () => void
}

export const HamburgerMenuButton: FC<HamburgerMenuButtonProps> = ({
  className,
  isExpanded,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'w-12 h-12 cursor-pointer swap swap-rotate',
        isExpanded && 'swap-active',
        className
      )}
      aria-label="menu"
    >
      <FontAwesomeIcon icon={faClose} className="swap-on w-5 h-5" />
      <FontAwesomeIcon icon={faBars} className="swap-off w-5 h-5" />
    </button>
  )
}
