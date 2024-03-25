import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import WalletIcon from 'assets/svg/icon-transaction.svg?react'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { getCurrentTransactionTab } from 'reducers/transaction'
import { getTransactionQueryParamsFilter } from 'utils/dashboardFilter'
import { getWalletBalance } from 'utils/transaction'

const WalletBalanceLabel: FC<{ credits: number }> = ({ credits }) => {
  const { t } = useTranslation()
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="h-8 xs+:h-12 text-base-content flex items-center">
      <p className="inline-block">{t('creditBalance.yourBalance')}</p>
      <p
        className={classnames(
          'inline-block mx-1 font-bold',
          credits < 0 ? 'text-error' : 'text-success'
        )}
      >
        {credits}
      </p>
      <p className="inline-block">{t('creditBalance.credits')}</p>
    </label>
  )
}

export const WalletBalance: FC = () => {
  const { fetchWallets } = useCaseKeeperContext()
  const [credits, setCredits] = useState<number>()

  const currentTabConfig = useSelector(getCurrentTransactionTab)

  useEffect(() => {
    if (!currentTabConfig?.id) return
    const queryParamsFilter = getTransactionQueryParamsFilter(currentTabConfig)
    fetchWallets(queryParamsFilter)
      .then(({ data }) => setCredits(getWalletBalance(data)))
      .catch(() => setCredits(undefined))
  }, [currentTabConfig, fetchWallets])

  if (!credits) return null

  return (
    <div className="flex items-center gap-2">
      <WalletIcon />
      <WalletBalanceLabel credits={credits} />
    </div>
  )
}
