/* eslint-disable import/no-unused-modules */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import type { RootState } from 'store'
import { Filter, Order, PaginationMeta } from 'types/generic'
import {
  Currency,
  Transaction,
  ApplicationTransactionRule,
} from 'types/exchange/transaction'
import { removeKeys } from 'utils/common'

export interface TransactionState {
  currentTransactionTab: Currency
  transactionFilters: {
    filter: Filter
    order: Order<unknown>
    page: number
  }
  transaction?: Transaction
  transactions?: Transaction[] | null
  meta: PaginationMeta | null
  currencies?: Currency[]
  applicationTransactionRules?: ApplicationTransactionRule[]
}

export const initialTransactionState: TransactionState = {
  currentTransactionTab: {
    id: '',
    name: '',
    displayName: '',
    value: 0,
  },
  transactionFilters: {
    filter: {},
    order: { createdAt: 'DESC' },
    page: 1,
  },
  transactions: null,
  meta: null,
}

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState: initialTransactionState,
  reducers: {
    setCurrencies: (state, { payload }) => {
      state.currencies = payload
    },
    setApplicationTransactionRules: (state, { payload }) => {
      state.applicationTransactionRules = payload
    },
    setTransaction: (state, { payload }) => {
      state.transaction = payload
    },
    setTransactions: (state, { payload }) => {
      state.transactions = payload
    },
    setTransactionsMeta: (state, { payload }) => {
      state.meta = payload
    },
    setTransactionFilters: (state, { payload }) => {
      state.transactionFilters = payload
    },
    setCurrentTransactionTab: (state, { payload }: PayloadAction<Currency>) => {
      state.currentTransactionTab = payload
    },
    setTransactionFilterPage: (state, { payload }: PayloadAction<number>) => {
      state.transactionFilters.page = payload
    },
    setTransactionFilterOrder: (
      state,
      { payload }: PayloadAction<Order<unknown>>
    ) => {
      state.transactionFilters.order = payload
    },
    setTransactionFilterOptions: (
      state,
      {
        payload: { filter = {}, removedKeys = [] },
      }: PayloadAction<{ filter?: Filter; removedKeys?: string[] }>
    ) => {
      state.transactionFilters.filter = {
        ...removeKeys(state.transactionFilters.filter, removedKeys),
        ...filter,
      }
    },
  },
})

export const {
  setCurrencies,
  setApplicationTransactionRules,
  setTransaction,
  setTransactions,
  setTransactionFilterOptions,
  setTransactionFilterOrder,
  setTransactionFilterPage,
  setTransactionFilters,
  setCurrentTransactionTab,
  setTransactionsMeta,
} = transactionSlice.actions

export const getTransactionState = (state: RootState) => state.transaction

export const getCurrencies = createSelector(
  getTransactionState,
  (state) => state.currencies
)
export const getApplicationTransactionRules = createSelector(
  getTransactionState,
  (state) => state.applicationTransactionRules
)
export const getTransaction = createSelector(
  getTransactionState,
  (state) => state.transaction
)
export const getTransactions = createSelector(
  getTransactionState,
  (state) => state.transactions
)
export const getTransactionsMeta = createSelector(
  getTransactionState,
  (state) => state.meta
)
export const getTransactionFilters = createSelector(
  getTransactionState,
  (state) => state.transactionFilters
)

export const getTransactionFiltersPage = createSelector(
  getTransactionState,
  (state) => state.transactionFilters.page
)

export const getTransactionFiltersOrder = createSelector(
  getTransactionState,
  (state) => state.transactionFilters.order
)

export const getTransactionFiltersOptions = createSelector(
  getTransactionState,
  (state) => state.transactionFilters.filter
)

export const getCurrentTransactionTab = createSelector(
  getTransactionState,
  (state) => state.currentTransactionTab
)

export default transactionSlice.reducer
