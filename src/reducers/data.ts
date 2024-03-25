import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import { Flow, FlowsResultKey } from 'types/caseKeeperCore'
import { DateRangeValue, Filter, Order, PaginationMeta } from 'types/generic'
import { removeKeys } from 'utils/common'
import { getInitialCreatedAtRange } from 'utils/filter'

export interface FlowsResult {
  data: Flow[] | null
  meta: PaginationMeta | null
  loading: boolean
  error: boolean
}

export interface DataState {
  filterCreatedAtRange: DateRangeValue
  sortOrder: Order<Flow>
  filterPopup: {
    filter: Filter
    searched: string
  }
  reload: Filter
  filterResult: Filter
  flowsResults: Record<FlowsResultKey, FlowsResult>
  currentPage: number
  flow: Flow | null
}

const defaultFlowsResult: FlowsResult = {
  data: null,
  meta: null,
  loading: false,
  error: false,
}

const initialState: DataState = {
  filterCreatedAtRange: getInitialCreatedAtRange(),
  sortOrder: { createdAt: 'DESC' },
  filterPopup: {
    filter: {},
    searched: '',
  },
  filterResult: {},
  reload: {},
  flowsResults: {
    [FlowsResultKey.PREVIOUS_PERIOD]: defaultFlowsResult,
    [FlowsResultKey.ALL]: defaultFlowsResult,
    [FlowsResultKey.BLOCKED]: defaultFlowsResult,
    [FlowsResultKey.PENDING_CLIENT]: defaultFlowsResult,
    [FlowsResultKey.PENDING_OPERATION]: defaultFlowsResult,
    [FlowsResultKey.RECEIVED]: defaultFlowsResult,
    [FlowsResultKey.COMPLETED]: defaultFlowsResult,
    [FlowsResultKey.VERIFIED]: defaultFlowsResult,
  },
  currentPage: 1,
  flow: null,
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setFilterCreatedAtRange: (
      state,
      { payload }: PayloadAction<DataState['filterCreatedAtRange']>
    ) => {
      state.filterCreatedAtRange = payload
    },
    setFilterPopup: (
      state,
      { payload }: PayloadAction<DataState['filterPopup']>
    ) => {
      state.filterPopup = payload
    },
    setFilterResult: (
      state,
      { payload }: PayloadAction<DataState['filterResult']>
    ) => {
      state.filterResult = payload
    },
    setReload: (state) => {
      state.reload = {}
    },
    setFilterPopupSearched: (state, { payload }: PayloadAction<string>) => {
      state.filterPopup = { ...state.filterPopup, searched: payload }
    },
    setFilterPopupOptions: (
      state,
      {
        payload: { filter = {}, removedKeys = [] },
      }: PayloadAction<{ filter?: Filter; removedKeys?: string[] }>
    ) => {
      state.filterPopup.filter = {
        ...removeKeys(state.filterPopup.filter, removedKeys),
        ...filter,
      }
    },
    setFlowsResult: (
      state,
      {
        payload,
      }: PayloadAction<{
        key: FlowsResultKey
        result: Partial<FlowsResult>
      }>
    ) => {
      state.flowsResults[payload.key] = {
        ...state.flowsResults[payload.key],
        ...payload.result,
      }
    },
    setCurrentPage: (state, { payload }: PayloadAction<number>) => {
      state.currentPage = payload
    },
    setSortOrder: (state, { payload }: PayloadAction<Order<Flow>>) => {
      state.sortOrder = payload
    },
  },
})

export const {
  setFilterCreatedAtRange,
  setFilterPopup,
  setFilterResult,
  setFlowsResult,
  setFilterPopupSearched,
  setFilterPopupOptions,
  setReload,
  setCurrentPage,
  setSortOrder,
} = dataSlice.actions

const getDataState = (state: RootState) => state?.data

export const getFilterCreatedAtRange = createSelector(
  getDataState,
  (state) => state.filterCreatedAtRange
)

export const getFilterPopup = createSelector(
  getDataState,
  (state) => state.filterPopup
)

export const getFilterResult = createSelector(
  getDataState,
  (state) => state.filterResult
)

export const getReload = createSelector(getDataState, (state) => state.reload)

export const getCurrentPage = createSelector(
  getDataState,
  (state) => state.currentPage
)

export const getSortOrder = createSelector(
  getDataState,
  (state) => state.sortOrder
)

export const getFlowsResultData = (key: FlowsResultKey) =>
  createSelector(getDataState, (state) => state.flowsResults[key]?.data)

export const getFlowsResultMeta = (key: FlowsResultKey) =>
  createSelector(getDataState, (state) => state.flowsResults[key]?.meta)

export const getFlowsResultCount = (key: FlowsResultKey) =>
  createSelector(getDataState, (state) => state.flowsResults[key]?.meta?.count)

export const getFlowsResultLoading = (key: FlowsResultKey) =>
  createSelector(getDataState, (state) => state.flowsResults[key]?.loading)

export const getFlowsResultError = (key: FlowsResultKey) =>
  createSelector(getDataState, (state) => state.flowsResults[key]?.error)

export default dataSlice.reducer
