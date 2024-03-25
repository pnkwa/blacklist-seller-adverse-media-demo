import { useState } from 'react'
import classNames from 'classnames'
import FullScreen from 'react-div-100vh'
import { Outlet } from 'react-router-dom'
import { Overlay } from '../Overlay'
import { Sidebar } from './Sidebar'

export const MainLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  return (
    <FullScreen>
      <Sidebar handleSidebarExpand={setIsSidebarExpanded} />
      <div
        className={classNames(
          'transition-all duration-200 pt-14 sm:pt-0',
          'h-full overflow-hidden text-base-content',
          isSidebarExpanded ? 'sm:ml-64' : 'sm:ml-16'
        )}
      >
        <Outlet />
      </div>
      <Overlay />
    </FullScreen>
  )
}
