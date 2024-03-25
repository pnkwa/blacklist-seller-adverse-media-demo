import { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import ChevronIcon from 'assets/svg/chevron-icon.svg?react'
import { routes } from 'config/routes'
import { Flow } from 'types/caseKeeperCore'
import {
  getCitizenIdFromFlow,
  getPassportFromFlow,
} from 'utils/caseKeeperCore/data'
import { FlowAvatarImage } from '../FlowAvatarImage'
import MenuButton from './MenuButton'
import { HistoryDropdown } from './HistoryDropdown'
import DownloadButton from './DownloadButton'

interface NavbarProps {
  name: string
  displayOverview: boolean
  flow: Flow
}

const Navbar: FC<NavbarProps> = ({ name, displayOverview, flow }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const personalId = useMemo(
    () =>
      flow?.verification?.passportConfig.required
        ? getPassportFromFlow(flow)
        : getCitizenIdFromFlow(flow),
    [flow]
  )
  const onBackPage = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0)
      return navigate(-1)
    return navigate(routes.backgroundCheck, { replace: true })
  }, [navigate])

  return (
    <div
      className={classNames(
        'bg-base-100 h-16 min-h-[4rem] flex items-center px-4 shadow-md',
        'z-10 justify-between'
      )}
    >
      <div className="flex items-center">
        <ChevronIcon
          className="inline-block cursor-pointer h-5 px-2"
          onClick={onBackPage}
        />
        {displayOverview && (
          <div className="flex rounded-badge border border-neutral-300 p-1 pr-4 items-center">
            <FlowAvatarImage className=" w-8" flow={flow} />
            <div>
              <p className="text-sm ml-2 font-bold">{name}</p>
              <p className="text-xs ml-2"> ID: {personalId ?? '-'}</p>
            </div>
          </div>
        )}
        {!displayOverview && (
          <div>
            <p className="text-base font-bold ml-2">{t('caseDetail.title')}</p>
            <p className="text-sm ml-2">{name}</p>
          </div>
        )}
      </div>
      <div className="hidden lg:flex flex-grow justify-end space-x-4 ">
        <div>
          <HistoryDropdown flow={flow} />
        </div>
        <div>
          <DownloadButton
            flow={flow}
            className="flex-1 !min-h-0 h-[38px] py-0 px-auto"
          />
        </div>
        <div>
          <MenuButton flow={flow} className="!min-h-0 h-[38px]" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
