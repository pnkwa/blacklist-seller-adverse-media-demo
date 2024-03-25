import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FlowTableTabItemConfig, FlowsResultKey } from 'types/caseKeeperCore'
import { UseFlowsReturn } from './useFlows'
import { useFlowsResultMap } from './useFlowsResultMap'

/**
 * a hook that manage the flow table tabs for "Overview" and "Background Check" page,
 * will read currentTab from search params
 */
export const useFlowTableTabs = (
  tabsConfig: FlowTableTabItemConfig[],
  defaultTab: FlowsResultKey,
  searchParamsKey = 'tab'
) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const { resultsMap } = useFlowsResultMap()

  const currentTab = useMemo((): FlowsResultKey => {
    const value = searchParams.get(searchParamsKey)
    return tabsConfig.find((tab) => tab.key === value)?.key ?? defaultTab
  }, [defaultTab, searchParams, searchParamsKey, tabsConfig])

  const setCurrentTab = useCallback(
    (tab: string | null, options?: { clearParams?: string[] }) =>
      setSearchParams((prev) => {
        options?.clearParams?.forEach((p) => prev.delete(p))
        if (tab === null) prev.delete(searchParamsKey)
        else prev.set(searchParamsKey, tab)
        return prev
      }),
    [searchParamsKey, setSearchParams]
  )

  const currentTabConfig = useMemo(
    () =>
      tabsConfig.find(
        (item) => item.key === currentTab
      ) as FlowTableTabItemConfig,
    [currentTab, tabsConfig]
  )

  const currentResult = useMemo(
    (): UseFlowsReturn => resultsMap[currentTab],
    [currentTab, resultsMap]
  )

  return useMemo(
    () => ({
      currentTab,
      currentTabConfig,
      currentResult,
      setCurrentTab,
    }),
    [currentResult, currentTab, currentTabConfig, setCurrentTab]
  )
}
