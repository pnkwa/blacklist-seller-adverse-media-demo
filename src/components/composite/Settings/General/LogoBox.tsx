import React, { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { t } from 'i18next'
import { ImageInputButton } from 'components/base/ImageInputButton'
import { useTenantConfigContext } from 'context/TenantConfigContext'

interface LogoBoxProps {
  onLogoChange: (logo: File) => void
  theme: 'darkTheme' | 'lightTheme'
}

export const LogoBox: React.FC<LogoBoxProps> = ({ onLogoChange, theme }) => {
  const [selectedLogo, setSelectedLogo] = useState<File>()
  const { client } = useTenantConfigContext()

  const onSelectLogo = useCallback(
    (file: File) => {
      setSelectedLogo(file)
      onLogoChange(file)
    },
    [onLogoChange]
  )

  const logoSource = useMemo(() => {
    if (selectedLogo) return URL.createObjectURL(selectedLogo)
    if (theme === 'darkTheme') return client.darkLogo
    return client.logo
  }, [selectedLogo, theme, client.logo, client.darkLogo])

  return (
    <div className="flex items-center w-full h-36 mr-4 ">
      <div
        className={classNames(
          'border-2 rounded-box w-32 h-32 max-h-60 mr-4 flex items-center',
          'justify-center',
          `${theme === 'darkTheme' ? 'bg-black' : 'bg-white'}`
        )}
      >
        <img className="max-w-28 w-20 sm:w-16" src={logoSource} alt="logo" />
      </div>
      <div className="flex flex-wrap content-between h-32 w-[160px]">
        <div>
          <p className="text-base font-bold">
            {t(`settingsPage.general.logoSetting.${theme}`)}
          </p>
          <p className="mb-2">
            {t(`settingsPage.general.logoSetting.${theme}Descriptions`)}
          </p>
        </div>

        <ImageInputButton onSelectImage={onSelectLogo} />
      </div>
    </div>
  )
}
