/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightFromBracket,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import { useKeycloak } from '@react-keycloak/web'
import { useTranslation } from 'react-i18next'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { getFirstLetter, joinStrings } from 'utils/string'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { SidebarItem } from './SidebarItem'

export const UserInfoItem = () => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()
  const { userInfo } = useCaseKeeperContext()
  const { keycloak } = useKeycloak()
  const { firstName, lastName, username } = userInfo ?? {}

  const [open, setOpen] = useState(false)

  const nameInitials = useMemo(
    () =>
      `${getFirstLetter(firstName)}${getFirstLetter(lastName)}` ||
      getFirstLetter(username),
    [firstName, lastName, username]
  )

  const displayedUsername = useMemo(
    () => joinStrings([firstName, lastName]) || username,
    [firstName, lastName, username]
  )

  return (
    <>
      <SidebarItem
        onClick={() => setOpen((prev) => !prev)}
        minimizedNode={
          <div className="avatar placeholder uppercase">
            <div className="bg-base-300 text-base-content font-black rounded-full w-10">
              {nameInitials}
            </div>
          </div>
        }
        expandedNode={
          <div className="flex overflow-hidden space-x-2 pl-2 items-center">
            <div className="flex-1 overflow-hidden capitalize">
              <div className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                {displayedUsername}
              </div>
              <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                {client.displayName || client.name}
              </div>
            </div>
            <div
              className={classNames(
                'swap swap-rotate p-4',
                open && 'swap-active'
              )}
            >
              <FontAwesomeIcon icon={faChevronUp} className="swap-on" />
              <FontAwesomeIcon icon={faChevronDown} className="swap-off" />
            </div>
          </div>
        }
      />
      <div
        className={classNames(
          'my-2 mx-2 px-1 py-1 bg-base-100/10 rounded-xl',
          !open && 'hidden'
        )}
      >
        <SidebarItem
          onClick={() => keycloak.logout()}
          minimizedNode={
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-lg"
            />
          }
          expandedNode={t('sidebar.logout')}
          outerClassName="!px-0"
          minimizedDivClassName="!min-w-[2.5rem]"
        />
      </div>
    </>
  )
}
