import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import IconFilter from 'assets/svg/icon-filter.svg?react'
import { openOverlay } from 'reducers'
import { OverlayType } from 'types/generic'
import {
  getTransactionFiltersOptions,
  setTransactionFilterOptions,
} from 'reducers/transaction'

// eslint-disable-next-line import/no-unused-modules
export const TransactionFilter: React.FC = () => {
  const dispatch = useDispatch()

  const { search } = useSelector(getTransactionFiltersOptions)
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined)

  const onClick = useCallback(() => {
    dispatch(openOverlay({ type: OverlayType.FILTER_TRANSACTION }))
  }, [dispatch])

  const onKeyDown = useCallback(
    (e) => {
      if (e.key !== 'Enter') return
      setTransactionFilterOptions({
        filter: {
          search: searchInput,
        },
      })
    },
    [searchInput]
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
          value={search}
          onChange={(e) => setSearchInput(e?.target?.value)}
          onKeyDown={onKeyDown}
        />
        <div className="absolute top-2 left-4">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-base-neutral opacity-50"
          />
        </div>
      </div>
      <div className="indicator">
        <button
          type="button"
          aria-label="Filter Icon"
          className={classNames(
            'btn btn-sm bg-base-100 border-base-300',
            'shadow-none text-base-300 w-10 h-10 p-1'
          )}
          onClick={onClick}
        >
          <IconFilter />
        </button>
      </div>
    </div>
  )
}
