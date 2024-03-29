import classNames from 'classnames'
import { TabItemConfig } from 'types/tabs'

interface TabsProps<T extends TabItemConfig> {
  tabs: T[]
  activeTab: string
  className?: string
  tabClass?: string
  activeTabClass?: string
  showContent?: boolean
  renderIcon?: (tab: T, isActive: boolean) => React.ReactNode
  onChangeTab: (key: string) => unknown
}

export function Tabs<T extends TabItemConfig>({
  tabs,
  activeTab,
  className,
  tabClass,
  activeTabClass,
  showContent = true,
  renderIcon,
  onChangeTab,
}: TabsProps<T>) {
  return (
    <>
      <div
        role="tablist"
        className={classNames(
          'w-full flex text-sm font-normal border-b border-base-200 overflow-x-auto',
          className
        )}
      >
        {tabs.map((tab) => {
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
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
      {showContent && tabs.find((tab) => activeTab === tab.key)?.content}
    </>
  )
}
