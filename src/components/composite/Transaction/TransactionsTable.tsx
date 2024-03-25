import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { Table } from 'components/base/Table'
import {
  getCurrentTransactionTab,
  getTransactionFiltersPage,
  getTransactions,
  getTransactionsMeta,
  setApplicationTransactionRules,
  setCurrencies,
  setCurrentTransactionTab,
} from 'reducers/transaction'
import { useTransaction } from 'hooks/useTransaction'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { transactionTableSpecs } from 'specs/transactionTableSpecs'
import { Pagination } from '../Pagination'

const TransactionsTable = () => {
  const dispatch = useDispatch()
  const { client } = useTenantConfigContext()

  const { loading, onChangePage, loadData } = useTransaction()
  const { fetchCurrencies, fetchApplicationTransactionRules } =
    useCaseKeeperContext()

  const currentTabConfig = useSelector(getCurrentTransactionTab)
  const transactions = useSelector(getTransactions)
  const meta = useSelector(getTransactionsMeta)
  const page = useSelector(getTransactionFiltersPage)

  const displayCurrencies = useMemo(
    () => client.caseKeeperConfig?.displayCurrencies,
    [client.caseKeeperConfig?.displayCurrencies]
  )

  const onStart = useCallback(async () => {
    try {
      const { data: currencies } = await fetchCurrencies(undefined, {
        createdAt: 'ASC',
      })
      if (!currencies) return
      const displayTabs = currencies.filter(
        ({ name }) => displayCurrencies?.includes(name)
      )

      dispatch(setCurrencies(displayTabs))
      dispatch(setCurrentTransactionTab(displayTabs[0]))
      const { data: applicationTransactionRules } =
        await fetchApplicationTransactionRules()
      dispatch(setApplicationTransactionRules(applicationTransactionRules))
    } catch (err) {
      console.error(err)
      dispatch(setCurrencies(undefined))
    }
  }, [
    dispatch,
    displayCurrencies,
    fetchApplicationTransactionRules,
    fetchCurrencies,
  ])

  useEffect(() => {
    onStart()
  }, [onStart])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-6 flex-1 overflow-x-auto">
        <Table
          key={currentTabConfig?.id}
          data={transactions ?? []}
          loading={loading}
          tableSpecs={transactionTableSpecs}
          tableClassName="table-pin-rows"
          theadClassName="table-header-group"
          rowClassName="table-row py-0"
          tdClassName="pb-4 py-4 px-4 text-center"
        />
      </div>
      {meta && (
        <div id="pagination" className="w-full px-6 pt-2">
          <Pagination meta={meta} page={page} onChange={onChangePage} />
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
