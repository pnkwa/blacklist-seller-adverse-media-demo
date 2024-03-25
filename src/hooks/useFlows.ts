import { useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Filter, Order } from 'types/generic'
import { isAbortError } from 'utils/error'
import {
  baseFilter,
  getBGCStatusFilter,
  getCreatedAtFilter,
} from 'utils/filter'
import { logger } from 'utils/logger'
import {
  FlowsResult,
  getFilterCreatedAtRange,
  getFilterResult,
  getFlowsResultCount,
  getFlowsResultData,
  getFlowsResultError,
  getFlowsResultLoading,
  getFlowsResultMeta,
  getReload,
  setFlowsResult,
} from 'reducers'
import { BackgroundApprovalStatus, BackgroundCheckStatus } from 'types/bgcCore'
import { FlowsResultKey } from 'types/caseKeeperCore'
import { getPreviousPeriodDateRange } from 'utils/date'

export interface UseFlowsReturn {
  key: FlowsResultKey
  loadData: (limit?: number, page?: number, order?: Order) => Promise<void>
  data: FlowsResult['data']
  meta: FlowsResult['meta']
  count: number | undefined
  loading: FlowsResult['loading']
  error: FlowsResult['error']
}

/**
 * returns the flow result state from redux that matches the specified key and filter
 */
export const useFlows = (key: FlowsResultKey): UseFlowsReturn => {
  const dispatch = useDispatch()
  const { fetchFlowsGroupedByProprietor } = useCaseKeeperContext()
  const abortControllerRef = useRef<AbortController | null>()

  const createdAtFilterValue = useSelector(getFilterCreatedAtRange)
  const filterResult = useSelector(getFilterResult)
  const reload = useSelector(getReload)

  const loading = useSelector(getFlowsResultLoading(key))
  const error = useSelector(getFlowsResultError(key))
  const meta = useSelector(getFlowsResultMeta(key))
  const count = useSelector(getFlowsResultCount(key))
  const data = useSelector(getFlowsResultData(key))

  const getFilterByKey = useCallback((): Filter => {
    switch (key) {
      case FlowsResultKey.PENDING_CLIENT:
        return {
          ...getBGCStatusFilter([
            BackgroundCheckStatus.OPEN,
            BackgroundCheckStatus.PENDING_CLIENT,
          ]),
          'backgroundCheck-expiresAt-$moreThan': new Date().toISOString(),
        }
      case FlowsResultKey.BLOCKED:
        return {
          ...getBGCStatusFilter([BackgroundCheckStatus.BLOCKED]),
          'backgroundCheck-approvalStatus-$in':
            BackgroundApprovalStatus.UNSPECIFIED,
        }
      case FlowsResultKey.PENDING_OPERATION:
        return getBGCStatusFilter([BackgroundCheckStatus.PENDING_OPERATION])
      case FlowsResultKey.RECEIVED:
        return getBGCStatusFilter([
          BackgroundCheckStatus.VERIFIED,
          BackgroundCheckStatus.COMPLETED,
        ])
      case FlowsResultKey.VERIFIED:
        return getBGCStatusFilter([BackgroundCheckStatus.VERIFIED])
      case FlowsResultKey.COMPLETED:
        return getBGCStatusFilter([BackgroundCheckStatus.COMPLETED])
      case FlowsResultKey.PREVIOUS_PERIOD:
        return getCreatedAtFilter(
          getPreviousPeriodDateRange(createdAtFilterValue)
        )
      case FlowsResultKey.ALL:
      default:
        return {}
    }
  }, [createdAtFilterValue, key])

  const loadData = useCallback(
    async (limit?: number, page?: number, sortOrder?: Order) => {
      try {
        dispatch(
          setFlowsResult({ key, result: { loading: true, error: false } })
        )
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()

        const query = {
          ...getCreatedAtFilter(createdAtFilterValue),
          ...getFilterByKey(),
          ...filterResult,
          ...reload,
        }

        const regex = /^(backgroundCheck-|verification-)/

        /** If filter was background check or verification will remove base filter because it no needs not null filter */
        const filteredQuery = Object.keys(query).some((k) => regex.test(k))
          ? query
          : { ...baseFilter, ...query }

        const data = await fetchFlowsGroupedByProprietor(
          filteredQuery,
          sortOrder,
          page ?? 1,
          limit,
          abortControllerRef.current.signal
        )
        dispatch(setFlowsResult({ key, result: { ...data, loading: false } }))
      } catch (err) {
        if (isAbortError(err)) return
        dispatch(
          setFlowsResult({ key, result: { loading: false, error: true } })
        )
        logger.error(err)
      }
    },
    [
      createdAtFilterValue,
      dispatch,
      fetchFlowsGroupedByProprietor,
      filterResult,
      getFilterByKey,
      key,
      reload,
    ]
  )

  return useMemo(
    () => ({
      key,
      loadData,
      data,
      meta,
      count,
      loading,
      error,
    }),
    [key, count, data, error, loadData, loading, meta]
  )
}
