import { useCallback, useRef, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import DownloadIcon from 'assets/svg/icon-bgc.svg?react'
import { useOnClickOutside } from 'hooks/clickOutside'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import {
  getCurrentTransactionTab,
  getTransactionFilters,
} from 'reducers/transaction'
import { getTransactionQueryParamsFilter } from 'utils/dashboardFilter'
import { Transaction } from 'types/exchange/transaction'
import { SpreadsheetMimetype } from 'types/generic/spreadsheet'
import { downloadSpreadSheet } from 'utils/download'
import { dateFormats } from 'config/dateFormats'
import { fetchAllPages } from 'utils/fetch'
import { transactionResultReportMapping } from 'helpers/export'
import { Spinner } from 'components/base/Spinner'
import { SpreadSheetFormatDropdown } from '../SpreadSheetFormat'

export const TransactionDownload = () => {
  const { fetchTransactions } = useCaseKeeperContext()

  const { filter, order } = useSelector(getTransactionFilters)
  const currentTransactionTab = useSelector(getCurrentTransactionTab)

  const [isReportLoading, setIsReportLoading] = useState(false)
  const [showSpreadsheetFormat, setShowSpreadsheetFormat] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  const fetchAllTransactions = useCallback(async (): Promise<Transaction[]> => {
    if (!currentTransactionTab.id) return []

    const queryParamsFilter = getTransactionQueryParamsFilter(
      currentTransactionTab,
      filter
    )

    return fetchAllPages<Transaction>(
      fetchTransactions,
      queryParamsFilter,
      order
    )
  }, [currentTransactionTab, fetchTransactions, filter, order])

  const generateReport = useCallback(
    (mimetype: SpreadsheetMimetype) => () => {
      if (!currentTransactionTab) return []
      setIsReportLoading(true)
      return fetchAllTransactions()
        .then((items) => {
          downloadSpreadSheet(
            items.map(transactionResultReportMapping),
            `${moment().format(dateFormats.compactISODate)}_Result_Report.${
              mimetype === 'text/csv' ? 'csv' : 'xlsx'
            }`,
            mimetype
          )
        })
        .catch(console.error)
        .finally(() => setIsReportLoading(false))
    },
    [currentTransactionTab, fetchAllTransactions]
  )

  useOnClickOutside(menuRef, () => {
    setShowSpreadsheetFormat(false)
  })

  return (
    <div>
      <button
        id="transaction-download-button"
        type="button"
        onClick={() => setShowSpreadsheetFormat(true)}
        disabled={isReportLoading}
        className={classNames(
          'btn-primary-selectable w-9 h-9 xs+:w-12 xs+:h-12',
          'flex items-center justify-center',
          showSpreadsheetFormat && 'active',
          isReportLoading && 'btn-disabled'
        )}
      >
        {!isReportLoading ? <DownloadIcon /> : <Spinner />}
      </button>
      {showSpreadsheetFormat && (
        <div ref={menuRef} className="relative z-20">
          <SpreadSheetFormatDropdown
            onExport={generateReport}
            className="right-0 -top-14"
          />
        </div>
      )}
    </div>
  )
}
