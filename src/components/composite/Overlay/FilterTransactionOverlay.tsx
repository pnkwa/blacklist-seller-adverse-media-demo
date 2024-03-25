import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import {
  getApplicationTransactionRules,
  getTransactionFiltersOptions,
  setTransactionFilterOptions,
} from 'reducers/transaction'
import { closeOverlay } from 'reducers/ui'
import { Dropdown } from 'components/base/Dropdown'
import { DateRangePicker } from 'components/form/DateRangePicker'
import { Dialog } from '../Dialog'

export const FilterTransactionOverlay = () => {
  const dispatch = useDispatch()

  const { t } = useTranslation()
  const { filter, search } = useSelector(getTransactionFiltersOptions)
  const applicationTransactionRules = useSelector(
    getApplicationTransactionRules
  )
  const [prevFilter, setPrevFilter] = useState({
    filter,
    search,
  })

  const transactionOptions = useMemo(() => {
    if (!applicationTransactionRules) return []
    return applicationTransactionRules.map((atr) => ({
      label: atr.transactionRule.name,
      value: atr.transactionRuleId,
    }))
  }, [applicationTransactionRules])

  const onConfirm = useCallback(() => {
    dispatch(closeOverlay())
    setPrevFilter({ filter, search })
  }, [dispatch, filter, search])

  const onClear = useCallback(() => {
    dispatch(setTransactionFilterOptions({}))
    dispatch(closeOverlay())
  }, [dispatch])

  const onClose = useCallback(() => {
    dispatch(
      setTransactionFilterOptions({
        filter: prevFilter,
      })
    )
    dispatch(closeOverlay())
  }, [dispatch, prevFilter])

  const clearFilter = useCallback(
    (key: string | string[]) =>
      dispatch(
        setTransactionFilterOptions({
          removedKeys: typeof key === 'string' ? [key] : key,
        })
      ),
    [dispatch]
  )

  const setFilter = useCallback(
    (key, value) => {
      if (value) {
        dispatch(
          setTransactionFilterOptions({
            filter: {
              [key]: value,
            },
          })
        )
      } else clearFilter([key])
    },
    [clearFilter, dispatch]
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
      <Dropdown
        options={transactionOptions}
        onChange={(item) => setFilter(item.key, item.value)}
      />
      <DateRangePicker
        value={filter?.createdAt}
        onSubmitDate={(value) => {
          if (value.length && value.every((v) => v))
            setFilter('createdAt', value)
          else setFilter('createdAt', null)
        }}
        defaultValue={undefined}
        className="pl-4 h-8 text-xs text-gray-400"
      />
    </Dialog>
  )
}
