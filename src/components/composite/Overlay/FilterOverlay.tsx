import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { getQueryParamsFilter } from 'utils/dashboardFilter'
import {
  closeOverlay,
  getFilterPopup,
  getFilterResult,
  setFilterPopup,
  setFilterPopupSearched,
  setFilterResult,
} from 'reducers'
import { dashboardFilterFieldConfig } from 'config/filter'
import { proprietorSearchableFieldConfigs } from 'config/searchFields'
import { FilterPopup } from '../BackgroundCheckPage/FilterPopup'
import { Dialog } from '../Dialog'

export const FilterOverlay = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  const { client } = useTenantConfigContext()
  const { t } = useTranslation()
  const { filter, searched } = useSelector(getFilterPopup)
  const filterResult = useSelector(getFilterResult)

  const [prevFilter, setPrevFilter] = useState({
    searched,
    filter,
  })

  const currentDashboardTabConfig = useMemo(() => {
    const searchParam = searchParams.get('tab')
    return (
      dashboardFilterFieldConfig.find((tab) => tab.key === searchParam) ??
      dashboardFilterFieldConfig[0]
    )
  }, [searchParams])

  const searchableFieldConfig = proprietorSearchableFieldConfigs.filter(
    (item) =>
      currentDashboardTabConfig
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

  const onConfirm = useCallback(() => {
    const paramsFilter = getQueryParamsFilter(
      client,
      currentDashboardTabConfig,
      searchableFieldConfig,
      { filter, searched }
    )
    setPrevFilter({ filter, searched })
    dispatch(setFilterPopupSearched(searched))
    dispatch(setFilterResult(paramsFilter))
    dispatch(closeOverlay())
  }, [
    client,
    currentDashboardTabConfig,
    dispatch,
    filter,
    searchableFieldConfig,
    searched,
  ])

  const onClear = useCallback(() => {
    if (Object.keys(filterResult).length) dispatch(setFilterResult({}))
    dispatch(setFilterPopup({ filter: {}, searched: '' }))
    dispatch(closeOverlay())
  }, [dispatch, filterResult])

  const onClose = useCallback(() => {
    dispatch(
      setFilterPopup({
        filter: prevFilter.filter,
        searched: prevFilter.searched,
      })
    )
    dispatch(closeOverlay())
  }, [dispatch, prevFilter])

  const onSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setFilterPopupSearched(e.target.value))
    },
    [dispatch]
  )

  return (
    <Dialog
      title={t('filters.searchFilters')}
      titleIconImg={<FontAwesomeIcon icon={faXmark} onClick={onClose} />}
      className="h-full w-full max-w-lg"
      childClass="overflow-hidden"
      onConfirm={onConfirm}
      confirmButtonLabel={t('filters.search')}
      onCancel={onClear}
      cancelButtonLabel={t('filters.clear')}
    >
      <FilterPopup
        dashboardTabConfig={currentDashboardTabConfig}
        isReset={false}
        searchInputValue={searched}
        searchFieldTooltipText={searchFieldTooltipText}
        onSearchInputChange={onSearchInputChange}
        onReset={() => {}}
      />
    </Dialog>
  )
}
