import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ClientConfig } from 'types/tenantConfig'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { renderMessage } from 'hooks/message'
import { MessageType } from 'components/base/Message'
import { routes } from 'config/routes'
import { SettingsLayout } from '../SettingsLayout'
import { PreviewBox } from './PreviewBox'
import { GeneralSettingsBox } from './GeneralSettingsBox'

export const GeneralSettings: FC = () => {
  const { t } = useTranslation()
  const { client, reload } = useTenantConfigContext()
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(false)
  const [formInput, setFormInput] = useState<ClientConfig>({
    documents: {},
    fontFamily: client.fontFamily,
    useChangeLanguageButton: client.kycCoreFeatures?.useChangeLanguageButton,
    useChangeThemeButton: client.kycCoreFeatures?.useChangeThemeButton,
  })
  const { updateClientConfig } = useCaseKeeperContext()

  const onNavigateClick = useCallback(() => {
    navigate(routes.overview)
  }, [navigate])

  const onConfirm = useCallback(async () => {
    try {
      if (!formInput) return

      const form = new FormData()
      if (formInput.documents) {
        Object.keys(formInput.documents).forEach((key) => {
          form.append(key, formInput.documents?.[key])
        })
      }
      Object.keys(formInput).forEach((key) => {
        if (key === 'documents') return
        form.append(key, JSON.stringify(formInput[key]))
      })
      setLoading(true)
      await updateClientConfig(form)
      await reload()

      setLoading(false)
      renderMessage({
        type: MessageType.Success,
        text: t('settingsPage.message.success'),
        destroyOnClose: true,
      })

      onNavigateClick()
    } catch (err) {
      setLoading(false)
      renderMessage({
        type: MessageType.Error,
        text: t('settingsPage.message.error'),
        destroyOnClose: true,
      })
      console.error(err)
    }
  }, [formInput, onNavigateClick, reload, t, updateClientConfig])

  return (
    <SettingsLayout
      title={t('settingsPage.general.title')}
      onConfirm={onConfirm}
      onCancel={onNavigateClick}
      confirmLoading={loading}
      contentWrapperClass="py-6 space-y-4 lg:space-y-0 lg:space-x-4 block lg:flex flex-wrap place-items-start"
    >
      <GeneralSettingsBox
        className="w-full lg:flex-[5]"
        setFormData={(e) => setFormInput(e)}
        formInput={formInput}
      />
      <PreviewBox className="w-full lg:flex-[3] bg-neutral-100" />
    </SettingsLayout>
  )
}
