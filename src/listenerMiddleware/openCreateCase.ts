/* eslint-disable no-await-in-loop */
import { createAction } from '@reduxjs/toolkit'
import { closeOverlay, openOverlay, setReload } from 'reducers'
import { OverlayType } from 'types/generic'
import { getOverlayConfirmed } from 'helpers/listenerMiddleware'
import { logger } from 'utils/logger'
import { createCKCService } from 'services/caseKeeperCore'
import { keycloak } from 'config/keycloak'
import { FlowInput } from 'types/caseKeeperCore'
import { AppListenerEffect, AppListenerEffectAPI } from 'store'
import { matchDuplicateFlows } from 'utils/duplicate'
import { renderMessage } from 'hooks/message'
import { MessageType } from 'components/base/Message'
import i18n from 'i18n'
import { chunk } from 'utils/common'
import { DuplicateFlow } from 'types/caseKeeperCore/duplicateFlow'

interface Data {
  inputs: FlowInput[]
}

export const openCreateCaseAction = createAction('OPEN_CREATE_CASE')

const doUpdating = async (listenerAPI: AppListenerEffectAPI, data: Data) => {
  try {
    const ckcInstance = createCKCService(keycloak.token)
    if (!data) return

    const duplicateFlows: DuplicateFlow[] = []
    const uniqFlows: FlowInput[] = []
    listenerAPI.dispatch(openOverlay({ type: OverlayType.LOADING }))

    const chunks = chunk(data.inputs, 5)
    // eslint-disable-next-line no-restricted-syntax
    for (const items of chunks) {
      const flows = await ckcInstance.findDuplicateFlow(items)
      const { duplicateFlows: dup, uniqFlows: uniq } = matchDuplicateFlows(
        items,
        flows
      )
      duplicateFlows.push(...dup)
      uniqFlows.push(...uniq)
    }
    listenerAPI.dispatch(closeOverlay())
    if (duplicateFlows?.length)
      // eslint-disable-next-line no-restricted-syntax
      for (const duplicateFlow of duplicateFlows) {
        listenerAPI.dispatch(
          openOverlay({
            type: OverlayType.DUPLICATE,
            props: duplicateFlow,
          })
        )
        const confirmed = await getOverlayConfirmed(listenerAPI)
        if (!confirmed?.payload?.confirmed) break
        if (confirmed?.payload.confirmed && confirmed?.payload.data)
          uniqFlows.push(confirmed?.payload.data)
      }

    if (uniqFlows?.length) {
      listenerAPI.dispatch(openOverlay({ type: OverlayType.LOADING }))
      // eslint-disable-next-line no-restricted-syntax
      for (const uniqFlow of uniqFlows) {
        await ckcInstance.createFlow(uniqFlow)
      }
      listenerAPI.dispatch(closeOverlay())
      listenerAPI.dispatch(setReload())
      renderMessage({
        type: MessageType.Success,
        text: i18n.t('duplicate.message.success', { count: uniqFlows.length }),
        destroyOnClose: true,
      })
    }
  } catch (err) {
    listenerAPI.dispatch(closeOverlay())
    renderMessage({
      type: MessageType.Error,
      text: i18n.t('duplicate.message.error'),
      destroyOnClose: true,
    })
    logger.error(err)
  }
}

export const openCreateCaseEffect: AppListenerEffect = async (
  _action,
  listenerAPI
) => {
  listenerAPI.cancelActiveListeners()

  /** show create case popup */
  listenerAPI.dispatch(
    openOverlay({
      type: OverlayType.CREATE_CASE,
    })
  )
  const confirmed = await getOverlayConfirmed(listenerAPI)
  if (!confirmed || !confirmed.payload.data) return
  const { data } = confirmed.payload

  await doUpdating(listenerAPI, data)
}
