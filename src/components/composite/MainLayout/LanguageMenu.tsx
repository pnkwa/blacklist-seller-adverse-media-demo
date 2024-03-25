import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import IconTH from 'assets/svg/icon-th.svg?react'
import IconEN from 'assets/svg/icon-en.svg?react'
import { SidebarItem } from './SidebarItem'

const languageItems = [
  { key: 'th', Icon: IconTH },
  { key: 'en', Icon: IconEN },
]

export const LanguageMenu = ({ isExpanded }: { isExpanded: boolean }) => {
  const { t, i18n } = useTranslation()
  const currentIcon = i18n.language === 'en' ? <IconEN /> : <IconTH />

  return (
    <div className={classNames('w-full dropdown sm:dropdown')}>
      <SidebarItem
        onClick={() => {}} // NOTE: need this empty func to make element clickable
        minimizedNode={currentIcon}
        expandedNode={t(`language.${i18n.language}`)}
      />
      <div
        className={classNames(
          'px-2  w-full dropdown-content',
          isExpanded && 'min-w-[15rem]'
        )}
      >
        <ul
          className={classNames(
            'menu space-y-1 bg-base-100 text-base-content w-full rounded-box',
            isExpanded && 'py-4'
          )}
        >
          {isExpanded && (
            <div className="font-bold text-md px-4">
              {t('sidebar.selectLanguage')}
            </div>
          )}
          {languageItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => i18n.changeLanguage(item.key)}
                className={classNames(
                  !isExpanded && 'px-0 flex justify-center'
                )}
              >
                <item.Icon />
                {isExpanded && t(`language.${item.key}`)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
