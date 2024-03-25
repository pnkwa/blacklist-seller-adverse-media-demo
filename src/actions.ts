/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction } from '@reduxjs/toolkit'

export const overlayButtonAction = createAction<{
  confirmed: boolean
  data?: any
}>('OVERLAY_BUTTON')
