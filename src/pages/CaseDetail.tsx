import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Flow } from 'types/caseKeeperCore'
import Navbar from 'components/composite/CaseDetail/Navbar'
import Overview from 'components/composite/CaseDetail/Overview'
import ProgressBar from 'components/composite/ProgressBar'
import SectionIndex from 'components/composite/CaseDetail/Section/Index'
import { Loading } from 'components/base'
import { Result } from 'components/base/Result'
import { useWindowDimensions } from 'hooks/useWindowDimensions'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import ManualApprove from 'components/composite/CaseDetail/ManualApprove'
import { breakpoints } from 'config/breakpoints'
import MenuButton from 'components/composite/CaseDetail/MenuButton'
import { HistoryDropdown } from 'components/composite/CaseDetail/HistoryDropdown'
import DownloadButton from 'components/composite/CaseDetail/DownloadButton'

const responsiveWidthSize = breakpoints.sm // sm

enum FetchStatus {
  SUCCESS = 'success',
  LOADING = 'loading',
  FAIL = 'fail',
}
const CaseDetail = () => {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const { fetchFlowById } = useCaseKeeperContext()

  const navigate = useNavigate()
  const { hash } = useLocation()
  const { width } = useWindowDimensions()

  const [flow, setFlow] = useState<Flow>({} as Flow)
  const [displayOverview, setDisplayOverview] = useState<boolean>(false)
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.SUCCESS)

  const handleScroll = useCallback(
    (event) => {
      const scrollTop = event?.currentTarget?.scrollTop
      /**
       * Define the height at which the overview component should be displayed
       * 345 is the height for scroll passed the overview component in responsive design (sm size).
       * 645 is the height for scroll passed the overview component in desktop design.
       */
      const height = responsiveWidthSize > width ? 645 : 345
      return setDisplayOverview(!!scrollTop && scrollTop > height)
    },
    [setDisplayOverview, width]
  )

  const getFlowById = useCallback(async () => {
    if (!id) return
    setStatus(FetchStatus.LOADING)
    try {
      const result = await fetchFlowById(id)
      setFlow(result)
      setStatus(FetchStatus.SUCCESS)
    } catch (e) {
      setStatus(FetchStatus.FAIL)
    }
  }, [fetchFlowById, id])

  const scrollIntoView = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const onClickProgressBarBtn = useCallback(
    (process: string) => {
      const hashProcess = hash?.substring(1)
      if (process === hashProcess) return scrollIntoView(hash?.substring(1))
      return navigate({ hash: `#${process}` }, { replace: true })
    },
    [hash, navigate, scrollIntoView]
  )

  const displayName = useMemo<string>(() => {
    if (!flow?.backgroundCheck?.verificationInfo) return '-'
    return getVerificationInfoFullName(
      flow.backgroundCheck.verificationInfo,
      true,
      i18n.language
    )
  }, [flow.backgroundCheck?.verificationInfo, i18n.language])

  useEffect(() => {
    getFlowById()
  }, [getFlowById])

  useEffect(() => {
    if (status === FetchStatus.SUCCESS) scrollIntoView(hash?.substring(1))
  }, [hash, scrollIntoView, status])

  return (
    <div className="bg-base-200 h-full flex flex-col overflow-hidden">
      <Navbar
        displayOverview={displayOverview}
        name={displayName}
        flow={flow}
      />
      <div
        onScroll={handleScroll}
        className={classNames(
          'flex-1 overflow-y-auto space-y-4 p-4 lg:flex flex-col relative'
        )}
      >
        {status === FetchStatus.LOADING && <Loading className="h-full" />}
        {status === FetchStatus.FAIL && (
          <Result
            faIcon={faExclamationCircle}
            title="Error"
            subTitle="Failed to fetch client data, please try again later"
          />
        )}
        {status === FetchStatus.SUCCESS && (
          <>
            <div className="lg:hidden flex flex-col space-y-4">
              <HistoryDropdown flow={flow} />
              <div className="flex flex-grow items-center space-x-4">
                <DownloadButton
                  flow={flow}
                  className="flex-1 !min-h-0 h-[38px] py-0 px-auto"
                />
                <MenuButton flow={flow} className="!min-h-0 h-[38px]" />
              </div>
            </div>
            <div className="flex gap-3 flex-col-reverse lg:flex-row">
              <Overview
                id="overview"
                className="lg:basis-full"
                name={displayName}
                flow={flow}
              />
              <ManualApprove
                className="lg:basis-3/5"
                flow={flow}
                onReload={getFlowById}
              />
            </div>
            <div className="flex flex-col lg:flex-row w-full flex-1">
              <div
                className={classNames(
                  'lg:max-h-[calc(100vh-100px)] h-fit p-4 py-6 rounded-lg bg-base-100',
                  'lg:max-w-[400px] shadow-md flex flex-col',
                  'lg:sticky lg:top-0 lg:left-0 lg:w-1/3 text-base-content'
                )}
              >
                <span className="pl-4 pb-2 font-bold">
                  {t('progressBar.title')}
                </span>
                <div className="h-full w-full lg:top-0 lg:left-0 lg:overflow-y-auto">
                  <ProgressBar
                    backgroundCheck={flow?.backgroundCheck}
                    onClick={onClickProgressBarBtn}
                  />
                </div>
              </div>
              <SectionIndex flow={flow} setFlow={setFlow} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CaseDetail
