import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import IconFilter from 'assets/svg/icon-filter.svg?react'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import {
  getFilterPopup,
  openOverlay,
  setFilterPopupSearched,
  setFilterResult,
} from 'reducers'
import { proprietorSearchableFieldConfigs } from 'config/searchFields'
import { getQueryParamsFilter } from 'utils/dashboardFilter'
import { OverlayType } from 'types/generic'
import { dashboardFilterFieldConfig } from 'config/filter'

export const FilterContainer: React.FC = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  const { client } = useTenantConfigContext()
  const { t } = useTranslation()
  const { filter, searched } = useSelector(getFilterPopup)

  const filterCount = useMemo(() => {
    let count = 0
    Object.keys(filter).forEach(
      (key) => !['tagOperator'].includes(key) && count++
    )
    return count
  }, [filter])

  const onClick = useCallback(() => {
    dispatch(openOverlay({ type: OverlayType.FILTER }))
  }, [dispatch])

  const onSearchInputChange = useCallback(
    (e) => {
      dispatch(setFilterPopupSearched(e.target.value))
    },
    [dispatch]
  )

  const currentDashboardTab = useMemo(() => {
    const searchParam = searchParams.get('tab')
    return (
      dashboardFilterFieldConfig.find((tab) => tab.key === searchParam) ??
      dashboardFilterFieldConfig[0]
    )
  }, [searchParams])

  const searchableFieldConfig = proprietorSearchableFieldConfigs.filter(
    (item) =>
      currentDashboardTab
        ?.getSearchFieldKeys(client)
        ?.includes(item.tenantSearchField)
  )

  const searchFieldTooltipText = useMemo(() => {
    const labels = searchableFieldConfig
      .map((item) => item?.label && t(item.label))
      .filter((item) => item)
      .join(', ')
    return t('filters.searchFieldTooltip.searchBy', { labels })
  }, [searchableFieldConfig, t])

  const onKeyDown = useCallback(
    (e) => {
      if (e.key !== 'Enter') return
      const paramsFilter = getQueryParamsFilter(
        client,
        currentDashboardTab,
        searchableFieldConfig,
        { filter, searched }
      )
      dispatch(setFilterResult(paramsFilter))
    },
    [
      client,
      currentDashboardTab,
      dispatch,
      filter,
      searchableFieldConfig,
      searched,
    ]
  )

  return (
    <div className="w-full sm:w-[400px] flex justify-between items-center">
      <div className="relative flex-1 pr-2">
        <input
          type="text"
          className={classNames(
            'input h-10 border-base-300 rounded-lg bg-transparent',
            'text-xs w-full pl-10'
          )}
          value={searched}
          onChange={onSearchInputChange}
          onKeyDown={onKeyDown}
          placeholder={searchFieldTooltipText}
        />
        <div className="absolute top-2 left-4">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-base-neutral opacity-50"
          />
        </div>
      </div>
      <div className="indicator">
        {filterCount > 0 && (
          <span className="indicator-item badge px-1.5 bg-base-content text-base-100">
            {filterCount}
          </span>
        )}
        <button
          type="button"
          aria-label="Filter Icon"
          className={classNames(
            'btn btn-sm bg-base-100 border-base-300',
            'shadow-none text-base-300 w-10 h-10 p-1',
            filterCount > 0 && 'border-base-content'
          )}
          onClick={onClick}
        >
          <IconFilter />
        </button>
      </div>
    </div>
  )
}
