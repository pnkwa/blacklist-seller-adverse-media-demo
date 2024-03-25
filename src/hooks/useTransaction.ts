import { useCallback, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Order } from 'types/generic'
import { isAbortError } from 'utils/error'
import { logger } from 'utils/logger'
import {
  getCurrentTransactionTab,
  getTransactionFilters,
  initialTransactionState,
  setCurrentTransactionTab,
  setTransactionFilterOrder,
  setTransactionFilterPage,
  setTransactionFilters,
  setTransactions,
  setTransactionsMeta,
} from 'reducers/transaction'
import { getTransactionQueryParamsFilter } from 'utils/dashboardFilter'
import { Currency } from 'types/exchange/transaction'

interface UseTransactionReturn {
  loading: boolean
  loadData: (limit?: number, page?: number, order?: Order) => Promise<void>
  onChangeOrder: (o: Order<unknown>) => void
  onChangePage: (p: number) => void
  onChangeTabs: (currency: Currency) => void
}

export const useTransaction = (): UseTransactionReturn => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { fetchTransactions } = useCaseKeeperContext()
  const currentTabConfig = useSelector(getCurrentTransactionTab)
  const { filter = {}, page, order } = useSelector(getTransactionFilters)

  const abortControllerRef = useRef<AbortController | null>()

  const loadData = useCallback(
    async (limit?: number) => {
      try {
        if (!currentTabConfig.id) return

        setLoading(true)
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()

        const getQueryParamsFilter = getTransactionQueryParamsFilter(
          currentTabConfig,
          filter
        )
        Object.assign(getQueryParamsFilter, {
          'transactionRuleId-$not-$isNull': '',
        })
        const transactions = await fetchTransactions(
          getQueryParamsFilter,
          order,
          page ?? 1,
          limit,
          abortControllerRef.current.signal
        )

        dispatch(setTransactionsMeta(transactions.meta))
        dispatch(setTransactions(transactions.data))
      } catch (err) {
        if (isAbortError(err)) return
        logger.error(err)
      }
      setLoading(false)
    },
    [currentTabConfig, dispatch, fetchTransactions, filter, order, page]
  )

  const onChangePage = useCallback(
    (p: number) => {
      dispatch(setTransactionFilterPage(p))
    },
    [dispatch]
  )

  const onChangeOrder = useCallback(
    (o: Order<unknown>) => {
      dispatch(setTransactionFilterOrder(o))
    },
    [dispatch]
  )

  const onClear = useCallback(() => {
    dispatch(setTransactionFilters(initialTransactionState.transactionFilters))
  }, [dispatch])

  const onChangeTabs = useCallback(
    (currency: Currency) => {
      dispatch(setCurrentTransactionTab(currency))
      dispatch(
        setTransactionFilters(initialTransactionState.transactionFilters)
      )
    },
    [dispatch]
  )

  return useMemo(
    () => ({
      loadData,
      loading,
      onChangeOrder,
      onChangePage,
      onChangeTabs,
      onClear,
    }),
    [loadData, loading, onChangeOrder, onChangePage, onChangeTabs, onClear]
  )
}
