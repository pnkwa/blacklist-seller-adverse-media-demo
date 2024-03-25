/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { getCurrencies, getCurrentTransactionTab } from 'reducers/transaction'
import { Dropdown } from 'components/base/Dropdown'
import { useTransaction } from 'hooks/useTransaction'

const TransactionDropdown = () => {
  const { t } = useTranslation()
  const currentTransactionTab = useSelector(getCurrentTransactionTab)
  const currencies = useSelector(getCurrencies)

  const { onChangeTabs } = useTransaction()

  const currentTabConfig = useMemo(
    () =>
      currentTransactionTab && {
        key: currentTransactionTab.id,
        label: currentTransactionTab.displayName || currentTransactionTab.name,
        iconURL: currentTransactionTab.iconURL || null,
        value: currentTransactionTab,
      },
    [currentTransactionTab]
  )

  const dropdownOptionConfigs = useMemo(
    () =>
      currencies &&
      currencies.map((currency) => ({
        key: currency.id,
        label: currency.displayName || currency.name,
        iconURL: currency?.iconURL || null,
        value: currency,
      })),
    [currencies]
  )

  const getLabelComponent = useCallback(
    (option) => (
      <div className="flex">
        {option?.iconURL && (
          <img
            alt={option?.name}
            src={option?.iconURL}
            className="w-[18px] h-[18px] mr-3"
          />
        )}
        <div className="mr-3">{option.label}</div>
      </div>
    ),
    []
  )

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <div>{t('transaction.title')}</div>
      <Dropdown
        className="text-sm w-full sm:w-[400px] z-30"
        classNames={{
          control: ({ isFocused }) =>
            classNames(
              '!cursor-pointer !rounded-lg !py-0 !border-base-300',
              isFocused &&
                '!border-base-content/25 !ring-2 !ring-offset-2 !ring-base-content/25 !shadow-none'
            ),
        }}
        menuPosition="fixed"
        value={currentTabConfig}
        options={dropdownOptionConfigs ?? []}
        onChange={({ value }) => onChangeTabs(value)}
        getOptionLabel={getLabelComponent}
        getOptionValue={getLabelComponent}
      />
    </div>
  )
}

export default TransactionDropdown
