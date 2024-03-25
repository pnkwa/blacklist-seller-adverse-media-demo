import { useTranslation } from 'react-i18next'
import VerifyBadge from 'components/base/VerifyBadge'

export const CriteriaSettingsLabel = () => {
  const { t } = useTranslation()
  return (
    <div className="flex sm:flex-1 items-center space-x-4">
      <span className="text-bold">
        {t('settingsPage.criteria.sectionTitle')}
      </span>
      <VerifyBadge label="generic.passed" verified />
    </div>
  )
}
