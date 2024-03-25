import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { TabItemConfig } from 'types/generic/tabs'

interface TabsProps<T extends TabItemConfig> {
  tabsConfig: T[]
  activeTab: string
  className?: string
  tabClass?: string
  activeTabClass?: string
  showContent?: boolean
  showCount?: boolean
  renderIcon?: (tab: T, isActive: boolean) => React.ReactNode
  renderCount?: (tab: T, isActive: boolean) => React.ReactNode
  onChangeTab: (key: string) => unknown
}

export function Tabs<T extends TabItemConfig>({
  tabsConfig,
  activeTab,
  className,
  tabClass,
  activeTabClass,
  showContent = true,
  showCount = false,
  renderIcon,
  renderCount,
  onChangeTab,
}: TabsProps<T>) {
  const { t } = useTranslation()

  return (
    <>
      <div
        role="tablist"
        className={classNames(
          'w-full flex text-sm font-normal border-b border-base-200 overflow-x-auto',
          className
        )}
      >
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              type="button"
              role="tab"
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={classNames(
                'tab border-b-2 transition-colors whitespace-nowrap inline-block',
                tabClass,
                isActive
                  ? classNames(
                      '!border-primary text-primary font-bold',
                      activeTabClass
                    )
                  : '!border-transparent text-neutral'
              )}
            >
              {renderIcon?.(tab, isActive)}
              <span>{t(tab.label)}</span>
              {(showCount && renderCount?.(tab, isActive)) ?? (
                <span className="ml-1"> ({tab.count ?? '...'})</span>
              )}
            </button>
          )
        })}
      </div>
      {showContent && tabsConfig.find((tab) => activeTab === tab.key)?.content}
    </>
  )
}
