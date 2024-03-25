import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FullScreen from 'react-div-100vh'
import { Result } from 'components/base/Result'

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <FullScreen className="flex items-center justify-center">
      <Result
        faIcon={faExclamationCircle}
        title={t('pageNotFound.title')}
        subTitle={t('pageNotFound.subTitle')}
      />
    </FullScreen>
  )
}

export default NotFoundPage
