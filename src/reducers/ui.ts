import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import type { RootState } from 'store'
import { OverlayType } from 'types/generic/overlay'
import { ColumnSettingsValue } from 'types/generic/table'

interface UIState {
  overlayType: OverlayType | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlayProps: Record<string, any>
  redirect?: { to: string; replace?: boolean }
  formEdited?: boolean
  columnSettings: ColumnSettingsValue
  refreshTenant: boolean
}

const initialState: UIState = {
  overlayType: undefined,
  overlayProps: {},
  columnSettings: undefined,
  refreshTenant: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openOverlay: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { payload }: PayloadAction<{ type: OverlayType; props?: any }>
    ) => {
      state.overlayProps =
        state.overlayType === payload.type
          ? { ...state.overlayProps, ...payload.props }
          : payload.props
      state.overlayType = payload.type
    },
    closeOverlay: (state) => {
      state.overlayType = initialState.overlayType
      state.overlayProps = initialState.overlayProps
    },
    setRedirect: (state, { payload }: PayloadAction<UIState['redirect']>) => {
      state.redirect = payload
    },
    setFormEdited: (state, { payload }: PayloadAction<boolean>) => {
      state.formEdited = payload
    },
    setColumnSettings: (
      state,
      { payload }: PayloadAction<UIState['columnSettings']>
    ) => {
      state.columnSettings = payload
    },
    setRefreshTenant: (state, { payload }: PayloadAction<boolean>) => {
      state.refreshTenant = payload
    },
  },
})

export const {
  openOverlay,
  closeOverlay,
  setRedirect,
  setFormEdited,
  setColumnSettings,
  setRefreshTenant,
} = uiSlice.actions

const getUIState = (state: RootState) => state?.ui

export const getOverlayType = createSelector(
  getUIState,
  (state) => state.overlayType
)

export const getOverlayProps = createSelector(
  getUIState,
  (state) => state.overlayProps
)

export const getRedirect = createSelector(getUIState, (state) => state.redirect)

export const getFormEdited = createSelector(
  getUIState,
  (state) => state.formEdited
)

export const getColumnSettings = createSelector(
  getUIState,
  (state) => state.columnSettings
)

export const getRefreshTenant = createSelector(
  getUIState,
  (state) => state.refreshTenant
)

export default uiSlice.reducer
