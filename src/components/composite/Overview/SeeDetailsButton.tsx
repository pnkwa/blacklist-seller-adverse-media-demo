import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface SeeDetailsButtonProps {
  className?: string
  onClick?: () => unknown
}

export const SeeDetailsButton = ({
  className,
  onClick,
}: SeeDetailsButtonProps) => {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className={classNames('btn btn-link btn-xs no-underline pr-0', className)}
      onClick={onClick}
    >
      {t('generic.seeDetails')}
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  )
}
