import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { PageContentLayout } from 'components/composite/MainLayout/PageContentLayout'
import TransactionsTable from 'components/composite/Transaction/TransactionsTable'
import TransactionDropdown from 'components/composite/Transaction/TransactionDropdown'
import { TransactionDownload } from 'components/composite/Transaction/TransactionDownload'
import { WalletBalance } from 'components/composite/Transaction/WalletBalance'

const TransactionsPage = () => {
  const { t } = useTranslation()

  return (
    <PageContentLayout title={t('transaction.title')}>
      <div className="content-box px-0 flex-1 flex flex-col overflow-hidden">
        <div
          className={classNames(
            'flex flex-col lg:flex-row mb-6 px-5 gap-4',
            'lg:items-center lg:justify-between'
          )}
        >
          <TransactionDropdown />
          {/* TODO: Improve filter V2 & V3 */}
          {/* <TransactionFilter /> */}
          <div className="flex items-center">
            <WalletBalance />
            <TransactionDownload />
          </div>
        </div>
        <TransactionsTable />
      </div>
    </PageContentLayout>
  )
}

export default TransactionsPage
