import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { t } from 'i18next'
import { Dropdown } from 'components/base/Dropdown'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { ToggleBox } from 'components/composite/Settings/General/ToggleBox'
import { ClientConfig, FontConfig } from 'types/tenantConfig'
import { sortByKey } from 'utils/common'
import { LogoBox } from './LogoBox'
import { ColorSettingsBox } from './ColorSettingsBox'
import { ApprovalReasonsBox } from './ApprovalReasonsBox'

interface BoxProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

const SettingsSectionBox: React.FC<BoxProps> = ({
  title,
  children,
  subtitle,
}) => (
  <div className="mb-4 border rounded-box p-4">
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="text-neutral-400">{subtitle}</p>
    {children}
  </div>
)

interface GeneralSettingsBoxProps {
  className?: string
  setFormData: (e) => void
  formInput?: ClientConfig
}

const getFontFamilyOptions = (list: FontConfig[] | undefined) =>
  list
    ?.map((option) => ({
      label: option.family,
      value: option,
    }))
    .sort(sortByKey('label', 'asc')) ?? []

export const GeneralSettingsBox: React.FC<GeneralSettingsBoxProps> = ({
  className,
  setFormData,
  formInput,
}) => {
  const { masterdatas, client } = useTenantConfigContext()

  const approvalReasons = useMemo(
    () => client.backgroundCheckDashboardConfig?.approvalReasons,
    [client.backgroundCheckDashboardConfig?.approvalReasons]
  )

  const rejectionReasons = useMemo(
    () => client.backgroundCheckDashboardConfig?.rejectionReasons,
    [client.backgroundCheckDashboardConfig?.rejectionReasons]
  )

  const fontOptions = useMemo(
    () => getFontFamilyOptions(masterdatas?.fontConfigs),
    [masterdatas]
  )

  const handleLogoChange = (key: string) => (e) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: e,
      },
    }))
  }

  const onChange = useCallback(
    (key: string) => (value) => {
      setFormData((prev) => {
        return {
          ...prev,
          [key]: value,
        }
      })
    },
    [setFormData]
  )

  return (
    <div
      className={classNames(
        'px-0 py-0 h-full w-full flex flex-col overflow-hidden',
        className
      )}
    >
      <SettingsSectionBox
        title={t('settingsPage.general.logoSetting.title')}
        subtitle={t('settingsPage.general.logoSetting.subTitle')}
      >
        <div className="flex flex-col sm:flex-row overflow-x-auto">
          <LogoBox theme="lightTheme" onLogoChange={handleLogoChange('logo')} />
          <LogoBox
            theme="darkTheme"
            onLogoChange={handleLogoChange('darkLogo')}
          />
        </div>
      </SettingsSectionBox>
      <SettingsSectionBox
        title={t('settingsPage.general.buttonsSettings.title')}
        subtitle={t('settingsPage.general.buttonsSettings.subTitle')}
      >
        <ToggleBox
          title={t(
            'settingsPage.general.buttonsSettings.changeThemeButton.title'
          )}
          subtitle={t(
            'settingsPage.general.buttonsSettings.changeThemeButton.subTitle'
          )}
          onToggleChange={onChange('useChangeThemeButton')}
          checked={!!formInput?.useChangeThemeButton}
        />
        <ToggleBox
          title={t(
            'settingsPage.general.buttonsSettings.changeLanguageButton.title'
          )}
          subtitle={t(
            'settingsPage.general.buttonsSettings.changeLanguageButton.subTitle'
          )}
          onToggleChange={onChange('useChangeLanguageButton')}
          checked={!!formInput?.useChangeLanguageButton}
        />
      </SettingsSectionBox>
      <SettingsSectionBox
        title={t('settingsPage.general.fontSettings.title')}
        subtitle={t('settingsPage.general.fontSettings.subTitle')}
      >
        <Dropdown
          className="text-sm w-full z-30 my-2"
          menuPosition="fixed"
          options={fontOptions}
          value={fontOptions.find(
            ({ value }) => value?.family === formInput?.fontFamily?.family
          )}
          placeholder="Font Family"
          onChange={({ value }) => onChange('fontFamily')(value)}
        />
      </SettingsSectionBox>
      <SettingsSectionBox
        title={t('settingsPage.general.colorSettings.title')}
        subtitle={t('settingsPage.general.colorSettings.subTitle')}
      >
        <ColorSettingsBox
          title={t('settingsPage.general.colorSettings.description')}
          setFormData={onChange('theme')}
          defaultTheme={client.theme}
        />
      </SettingsSectionBox>
      <SettingsSectionBox title={t('settingsPage.general.approvedReason')}>
        <ApprovalReasonsBox reasons={approvalReasons} />
      </SettingsSectionBox>
      <SettingsSectionBox title={t('settingsPage.general.rejectedReason')}>
        <ApprovalReasonsBox reasons={rejectionReasons} />
      </SettingsSectionBox>
    </div>
  )
}
