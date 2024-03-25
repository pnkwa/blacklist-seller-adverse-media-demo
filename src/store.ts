import {
  configureStore,
  createListenerMiddleware,
  ListenerEffect,
  ListenerEffectAPI,
  PayloadAction,
  TypedStartListening,
} from '@reduxjs/toolkit'

import uiReducer from 'reducers/ui'
import dataReducer from 'reducers/data'
import transactionReducer from 'reducers/transaction'
import { env } from 'config/env'

const listenerMiddleware = createListenerMiddleware()

const enableDevTools =
  process.env.NODE_ENV !== 'production' ||
  /(dev|qa|uat|local)/.test(env.ENVIRONMENT)

const store = configureStore({
  reducer: {
    ui: uiReducer,
    data: dataReducer,
    transaction: transactionReducer,
  },
  devTools: enableDevTools
    ? { name: `${document.title} [${window.location.host}]` }
    : false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export type AppListenerEffect<P = unknown> = ListenerEffect<
  PayloadAction<P>,
  RootState,
  AppDispatch
>

type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>
export const startAppListening =
  listenerMiddleware.startListening as AppStartListening

export default store
