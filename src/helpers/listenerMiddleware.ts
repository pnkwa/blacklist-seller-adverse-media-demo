import { isAnyOf } from '@reduxjs/toolkit'
import { overlayButtonAction } from 'actions'
import { AppListenerEffectAPI } from 'store'

/**
 * wait for the `overlayButtonAction` action to be dispatched,
 * then check the action's type and payload.
 *
 * returns the action if user pressed confirm, `undefined` if pressed cancel
 */
export const getOverlayConfirmed = async (
  listenerAPI: AppListenerEffectAPI
) => {
  const [btnAction] = await listenerAPI.take(isAnyOf(overlayButtonAction))
  if (btnAction.payload.confirmed) return btnAction
  return undefined
}
