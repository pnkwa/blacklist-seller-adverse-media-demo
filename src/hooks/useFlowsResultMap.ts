import { useMemo } from 'react'
import { FlowsResultKey } from 'types/caseKeeperCore'
import { UseFlowsReturn, useFlows } from './useFlows'

interface UseFlowsResultMapReturn {
  resultsMap: Record<FlowsResultKey, UseFlowsReturn>
  resultsCountMap: Record<FlowsResultKey, number | undefined>
}

export const useFlowsResultMap = (): UseFlowsResultMapReturn => {
  const all = useFlows(FlowsResultKey.ALL)
  const allTime = useFlows(FlowsResultKey.PREVIOUS_PERIOD)
  const pendingClient = useFlows(FlowsResultKey.PENDING_CLIENT)
  const blocked = useFlows(FlowsResultKey.BLOCKED)
  const pendingOperation = useFlows(FlowsResultKey.PENDING_OPERATION)
  const received = useFlows(FlowsResultKey.RECEIVED)
  const verified = useFlows(FlowsResultKey.VERIFIED)
  const completed = useFlows(FlowsResultKey.COMPLETED)

  const resultsMap = useMemo(
    () => ({
      [FlowsResultKey.ALL]: all,
      [FlowsResultKey.PREVIOUS_PERIOD]: allTime,
      [FlowsResultKey.PENDING_CLIENT]: pendingClient,
      [FlowsResultKey.BLOCKED]: blocked,
      [FlowsResultKey.PENDING_OPERATION]: pendingOperation,
      [FlowsResultKey.RECEIVED]: received,
      [FlowsResultKey.VERIFIED]: verified,
      [FlowsResultKey.COMPLETED]: completed,
    }),
    [
      all,
      allTime,
      blocked,
      completed,
      pendingClient,
      pendingOperation,
      received,
      verified,
    ]
  )

  const resultsCountMap = useMemo(
    () => ({
      [FlowsResultKey.ALL]: all.count,
      [FlowsResultKey.PREVIOUS_PERIOD]: allTime.count,
      [FlowsResultKey.PENDING_CLIENT]: pendingClient.count,
      [FlowsResultKey.BLOCKED]: blocked.count,
      [FlowsResultKey.PENDING_OPERATION]: pendingOperation.count,
      [FlowsResultKey.RECEIVED]: received.count,
      [FlowsResultKey.VERIFIED]: verified.count,
      [FlowsResultKey.COMPLETED]: completed.count,
    }),
    [
      all.count,
      allTime.count,
      blocked.count,
      completed.count,
      pendingClient.count,
      pendingOperation.count,
      received.count,
      verified.count,
    ]
  )

  return { resultsMap, resultsCountMap }
}
