import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { PageContentLayout } from 'components/composite/MainLayout/PageContentLayout'
import { Tabs } from 'components/base/Tabs'
import { TabItemConfig } from 'types/generic/tabs'
import { GeneralSettings } from 'components/composite/Settings/General/GeneralSettings'
import { CriteriaSettings } from 'components/composite/Settings/Criteria/CriteriaSettings'
import { checkPermissionsField } from 'utils/permission'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Permission } from 'types/caseKeeperCore'
import { updateClientPrms } from 'config/permission'
import {
  canConfigCriteria,
  getAllPositionsCriteriaMapping,
} from 'utils/criteria'
import { useTenantConfigContext } from 'context/TenantConfigContext'

const checkUpdateCriteriaPermissions = (
  permissions: Permission[] | undefined
) =>
  checkPermissionsField(
    updateClientPrms,
    'useCriteriaSettingsByPosition',
    permissions
  ) && checkPermissionsField(updateClientPrms, 'positions', permissions)

const SettingsPage = () => {
  const { t } = useTranslation()
  const { permissions } = useCaseKeeperContext()
  const { client } = useTenantConfigContext()

  const [currentTab, setCurrentTab] = useState('general')

  /** check if the client is verifying the processes that can configure criteria */
  const hasCriteriaSettings = useMemo(
    () => canConfigCriteria(getAllPositionsCriteriaMapping(client)),
    [client]
  )

  const tabsConfig: TabItemConfig[] = useMemo(
    () =>
      [
        {
          key: 'general',
          label: 'settingsPage.general.title',
          content: <GeneralSettings />,
        },
        checkUpdateCriteriaPermissions(permissions) &&
          hasCriteriaSettings && {
            key: 'criteria',
            label: 'settingsPage.criteria.tabTitle',
            content: <CriteriaSettings />,
          },
      ].filter((item) => item) as TabItemConfig[],
    [hasCriteriaSettings, permissions]
  )

  return (
    <PageContentLayout
      title={t('settingsPage.pageTitle')}
      contentWrapperClassName="sm:flex"
    >
      <div
        className={classNames(
          'content-box px-2 sm:px-4 pb-0 flex-1 flex flex-col',
          'overflow-hidden'
        )}
      >
        <Tabs
          tabsConfig={tabsConfig}
          activeTab={currentTab}
          onChangeTab={setCurrentTab}
        />
      </div>
    </PageContentLayout>
  )
}

export default SettingsPage
