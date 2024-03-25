import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { getOverlayType, setFilterPopup, setFilterResult } from 'reducers'
import IconDashboard from 'assets/svg/icon-dashboard.svg?react'
import IconBackgroundCheck from 'assets/svg/icon-bgc.svg?react'
import IconHelp from 'assets/svg/icon-help-circle.svg?react'
import IconSetting from 'assets/svg/icon-setting.svg?react'
import TransactionIcon from 'assets/svg/icon-transaction.svg?react'
import { routes } from 'config/routes'
import { breakpoints } from 'config/breakpoints'
import { checkPermissions } from 'utils/permission'
import { readExchangePrms, updateClientPrms } from 'config/permission'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { HamburgerMenuButton } from './HamburgerMenuButton'
import { SidebarItem } from './SidebarItem'
import { AppLogo } from './AppLogo'
import { UserInfoItem } from './UserMenu'
import { LanguageMenu } from './LanguageMenu'

interface SidebarProps {
  handleSidebarExpand: (isExpand: boolean) => void
}

const Divider = () => (
  <div className="mx-4 border-b border-base-100 opacity-30 pt-2 mb-2" />
)

export const Sidebar: FC<SidebarProps> = ({ handleSidebarExpand }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const overlayType = useSelector(getOverlayType)
  const { permissions } = useCaseKeeperContext()
  const isPathActive = useCallback(
    (route: string) => !!matchPath({ path: route }, location.pathname),
    [location]
  )

  const onNavigateClick = useCallback(
    (path: string) => {
      const isMobile = window.innerWidth < breakpoints.sm
      if (isMobile) setIsExpanded(false)
      navigate(path)
    },
    [navigate]
  )

  const clearFilters = useCallback(() => {
    dispatch(setFilterResult({}))
    dispatch(setFilterPopup({ filter: {}, searched: '' }))
  }, [dispatch])

  useEffect(() => {
    if (overlayType) setIsExpanded(false)
  }, [overlayType])

  useEffect(() => {
    handleSidebarExpand(isExpanded)
  }, [isExpanded, handleSidebarExpand])

  return (
    <div
      id="sidebar"
      className={classNames(
        'absolute top-0 left-0 z-30 bg-gray-900 text-base-100 transition-all duration-200',
        'overflow-x-hidden sm:overflow-y-auto',
        'w-screen sm:h-full',
        isExpanded ? 'h-full overflow-y-auto' : 'h-14 overflow-y-hidden', // mobile
        isExpanded ? 'sm:w-64' : 'sm:w-16' // desktop
      )}
    >
      <SidebarItem
        className="py-0 sm:py-3"
        minimizedNode={
          <HamburgerMenuButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded((e) => !e)}
          />
        }
        expandedNode={<AppLogo />}
      />
      <UserInfoItem />
      <Divider />
      <SidebarItem
        onClick={() => {
          clearFilters()
          onNavigateClick(routes.overview)
        }}
        active={isPathActive(routes.overview)}
        minimizedNode={<IconDashboard />}
        expandedNode={<div>{t('sidebar.dashboard')}</div>}
      />
      <SidebarItem
        onClick={() => {
          clearFilters()
          onNavigateClick(routes.backgroundCheck)
        }}
        active={isPathActive(routes.backgroundCheck)}
        minimizedNode={<IconBackgroundCheck />}
        expandedNode={<div>{t('sidebar.backgroundCheck')}</div>}
      />
      <Divider />
      <SidebarItem
        onClick={() => onNavigateClick(routes.help)}
        active={isPathActive(routes.help)}
        minimizedNode={<IconHelp />}
        expandedNode={<div>{t('sidebar.help')}</div>}
      />
      {checkPermissions(updateClientPrms, permissions) && (
        <SidebarItem
          onClick={() => onNavigateClick(routes.settings)}
          active={isPathActive(routes.settings)}
          minimizedNode={<IconSetting />}
          expandedNode={<div>{t('sidebar.setting')}</div>}
        />
      )}
      {checkPermissions(readExchangePrms, permissions) && (
        <SidebarItem
          onClick={() => onNavigateClick(routes.transactions)}
          active={isPathActive(routes.transactions)}
          minimizedNode={<TransactionIcon />}
          expandedNode={<div>{t('transaction.title')}</div>}
        />
      )}
      <Divider />
      <LanguageMenu isExpanded={isExpanded} />
    </div>
  )
}
