import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { openCreateCaseAction } from 'listenerMiddleware/openCreateCase'

export const CreateCaseButton = () => {
  const dispatch = useDispatch()

  const { t } = useTranslation()

  const openCreateCase = useCallback(() => {
    dispatch(openCreateCaseAction())
  }, [dispatch])

  return (
    <button type="button" className="btn btn-primary" onClick={openCreateCase}>
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faPlus}
          className="border border-base-100 h-3 w-3 p-0.5 mr-2 rounded-full"
        />
        {t('backgroundCheckPage.createCase')}
      </div>
    </button>
  )
}
