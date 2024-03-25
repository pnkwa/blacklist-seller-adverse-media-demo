import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { renderMessage } from 'hooks/message'
import { MessageType } from 'components/base/Message'
import { routes } from 'config/routes'
import { useModal } from 'hooks/useModal'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import {
  applyCriteria,
  getAllPositionsCriteriaMapping,
  validateCriteriaMapping,
} from 'utils/criteria'
import { Toggle } from 'components/base'
import { WarningConfirmModal } from '../../Modal/WarningConfirmModal'
import { SettingsLayout } from '../SettingsLayout'
import { CriteriaForm } from './CriteriaForm'
import { CriteriaSettingsByPosition } from './CriteriaSettingsByPosition'
import { CriteriaSettingsLabel } from './CriteriaSettingsLabel'

export const CriteriaSettings: React.FC = () => {
  const { t } = useTranslation()
  const { client, reload } = useTenantConfigContext()
  const modal = useModal()

  const navigate = useNavigate()
  const { updateClientConfig } = useCaseKeeperContext()

  const [loading, setLoading] = useState(false)
  const [edited, setEdited] = useState(false)
  const [allPositionsCriteriaMapping, setAllPositionsCriteriaMapping] =
    useState(() => getAllPositionsCriteriaMapping(client))

  const useCriteriaSettingsByPosition =
    !!client.backgroundCheckDashboardFeatures?.useCriteriaSettingsByPosition

  const onCancelClick = useCallback(() => {
    navigate(routes.overview)
    // TODO: check edited and show confirm modal
  }, [navigate])

  const doUpdate = useCallback(
    async (formData: FormData) => {
      try {
        setLoading(true)
        await updateClientConfig(formData)
        const updatedClient = await reload()
        setLoading(false)
        setEdited(false)
        if (updatedClient)
          setAllPositionsCriteriaMapping(
            getAllPositionsCriteriaMapping(updatedClient)
          )
        renderMessage({
          type: MessageType.Success,
          text: t('settingsPage.message.success'),
          destroyOnClose: true,
        })
      } catch (err) {
        setLoading(false)
        renderMessage({
          type: MessageType.Error,
          text: t('settingsPage.message.error'),
          destroyOnClose: true,
        })
        console.error(err)
      }
    },
    [reload, t, updateClientConfig]
  )

  const onToggleChange = useCallback(
    (e) => {
      const { checked } = e.target
      // eslint-disable-next-line max-len
      const translationPrefix = `settingsPage.criteria.useCriteriaSettingsByPosition.${
        checked ? 'on' : 'off'
      }`
      modal.renderElement(
        <WarningConfirmModal
          title={t(`${translationPrefix}.confirmTitle`)}
          subTitle={t(`${translationPrefix}.confirmMessage`)}
          cancelButtonLabel={t('generic.cancel')}
          modalClass="!max-w-[24rem]"
          onCancel={modal.destroy}
          onConfirm={async () => {
            modal.destroy()
            const formData = new FormData()
            formData.append(
              'useCriteriaSettingsByPosition',
              JSON.stringify(checked)
            )
            if (!checked) {
              const newPositions = JSON.parse(
                JSON.stringify(
                  client.backgroundCheckDashboardConfig?.positions ?? {}
                )
              )
              Object.keys(newPositions).forEach((key) => {
                applyCriteria(newPositions[key], {})
              })
              formData.append('positions', JSON.stringify(newPositions))
            }
            await doUpdate(formData)
          }}
        />
      )
    },
    [client.backgroundCheckDashboardConfig?.positions, doUpdate, modal, t]
  )

  const onConfirm = useCallback(async () => {
    const newPositions = JSON.parse(
      JSON.stringify(client.backgroundCheckDashboardConfig?.positions ?? {})
    )
    Object.keys(newPositions).forEach((key) => {
      applyCriteria(newPositions[key], allPositionsCriteriaMapping)
    })
    const formData = new FormData()
    formData.append('positions', JSON.stringify(newPositions))
    await doUpdate(formData)
  }, [
    allPositionsCriteriaMapping,
    client.backgroundCheckDashboardConfig?.positions,
    doUpdate,
  ])

  // TODO: responsive ui
  return (
    <SettingsLayout
      title={
        !useCriteriaSettingsByPosition
          ? t('settingsPage.criteria.titleOverall')
          : t('settingsPage.criteria.titleByPosition')
      }
      subTitle={t('settingsPage.criteria.subTitle')}
      onConfirm={onConfirm}
      onCancel={onCancelClick}
      confirmLoading={loading}
      isConfirmButtonDisabled={
        !edited || !validateCriteriaMapping(allPositionsCriteriaMapping)
      }
      hideButtons={useCriteriaSettingsByPosition}
    >
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4 sm:items-center">
        <CriteriaSettingsLabel />
        <div className="flex items-center space-x-2">
          <label
            htmlFor="useCriteriaSettingsByPosition"
            className="cursor-pointer"
          >
            {t('settingsPage.criteria.useCriteriaSettingsByPosition.label')}
          </label>
          <Toggle
            id="useCriteriaSettingsByPosition"
            name="useCriteriaSettingsByPosition"
            checked={useCriteriaSettingsByPosition}
            onChange={onToggleChange}
          />
        </div>
      </div>
      <div className="space-y-4 mt-4">
        {useCriteriaSettingsByPosition ? (
          <CriteriaSettingsByPosition />
        ) : (
          <CriteriaForm
            criteriaMapping={allPositionsCriteriaMapping}
            initialCriteriaMapping={getAllPositionsCriteriaMapping(client)}
            onChange={(v) => {
              setEdited(true)
              setAllPositionsCriteriaMapping(v)
            }}
          />
        )}
      </div>
    </SettingsLayout>
  )
}
