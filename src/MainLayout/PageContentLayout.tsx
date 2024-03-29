import classNames from 'classnames'
import { Link } from 'react-router-dom'
import AppmanLogo from 'assets/svg/icon-appman-logo.svg?react'
import IconSetting from 'assets/svg/icon-setting.svg?react'

interface PageContentLayoutProps {
  children?: React.ReactNode
}

export const PageContentLayout = ({ children }: PageContentLayoutProps) => {
  return (
    <div className="bg-base-200 h-full flex flex-col overflow-hidden">
      <div
        className={classNames(
          'sm:bg-base-100 sm:h-16 sm:min-h-[4rem] items-center pt-4 sm:pt-0 px-4 sm:shadow-box font-bold flex justify-between'
        )}
      >
        <Link to="/" aria-label="Home">
          <AppmanLogo />
        </Link>
        <Link
          to="/settings"
          aria-label="Settings"
          className={classNames(
            'btn btn-sm btn-circle btn-ghost w-9 h-9 xs+:w-12',
            'xs+:h-12 flex items-center justify-center'
          )}
        >
          <IconSetting />
        </Link>
      </div>

      <div
        className={classNames(
          'flex-1 overflow-y-auto p-4 space-y-4 flex flex-col h-dvh'
        )}
      >
        {children}
      </div>
    </div>
  )
}
