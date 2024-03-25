import { createAction } from '@reduxjs/toolkit'
import { closeOverlay, openOverlay, setRefreshTenant } from 'reducers'
import { OverlayType } from 'types/generic'
import { getOverlayConfirmed } from 'helpers/listenerMiddleware'
import { logger } from 'utils/logger'
import { createCKCService } from 'services/caseKeeperCore'
import { keycloak } from 'config/keycloak'
import { AppListenerEffect, AppListenerEffectAPI } from 'store'
import { renderMessage } from 'hooks/message'
import { MessageType } from 'components/base/Message'
import i18n from 'i18n'
import { Client, PositionConfig } from 'types/tenantConfig'
import { applyCriteria } from 'utils/criteria'
import { CriteriaMapping } from 'types/bgcCore'

interface Payload {
  positionConfig: PositionConfig
  client: Client
}

export const openEditPositionCriteriaAction = createAction<Payload>(
  'OPEN_EDIT_POSITION_CRITERIA'
)

const doUpdating = async (
  listenerAPI: AppListenerEffectAPI,
  payload: Payload,
  data: CriteriaMapping
) => {
  try {
    const ckcInstance = createCKCService(keycloak.token)
    if (!data) return

    listenerAPI.dispatch(openOverlay({ type: OverlayType.LOADING }))
    const formData = new FormData()
    const newPositions = JSON.parse(
      JSON.stringify(payload.client.backgroundCheckDashboardConfig?.positions)
    )
    ;(Object.values(newPositions) as PositionConfig[]).forEach(
      (p: PositionConfig) => {
        if (p.position?.key !== payload.positionConfig.position?.key) return
        applyCriteria(p, data)
      }
    )
    formData.append('positions', JSON.stringify(newPositions))
    await ckcInstance.updateClientConfig(formData)
    listenerAPI.dispatch(closeOverlay())
    listenerAPI.dispatch(setRefreshTenant(true))
    renderMessage({
      type: MessageType.Success,
      text: i18n.t('settingsPage.message.success'),
      destroyOnClose: true,
    })
  } catch (err) {
    listenerAPI.dispatch(closeOverlay())
    renderMessage({
      type: MessageType.Error,
      text: i18n.t('settingsPage.message.error'),
      destroyOnClose: true,
    })
    logger.error(err)
  }
}

export const openEditPositionCriteriaEffect: AppListenerEffect<
  Payload
> = async (action, listenerAPI) => {
  listenerAPI.cancelActiveListeners()

  /** show create case popup */
  listenerAPI.dispatch(
    openOverlay({
      type: OverlayType.POSITION_CRITERIA_SETTINGS,
      props: { positionConfig: action.payload.positionConfig },
    })
  )
  const confirmed = await getOverlayConfirmed(listenerAPI)
  if (!confirmed || !confirmed.payload.data) return

  const { data } = confirmed.payload

  await doUpdating(listenerAPI, action.payload, data)
}
