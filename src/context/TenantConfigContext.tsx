import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import FullScreen from 'react-div-100vh'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { FullScreenLoading } from 'components/base'
import { overrideTranslations } from 'i18n'
import { Client, Lead, MasterdataLinks, Masterdatas } from 'types/tenantConfig'
import { fetchLeadData, fetchTenantData } from 'services/tenantConfig'
import { findClientName } from 'utils/path'
import { setTailwindTheme } from 'utils/theme'
import { logger } from 'utils/logger'
import { isAbortError } from 'utils/error'
import { env } from 'config/env'
import { defaultClient } from 'config/defaultClient'
import { Result } from 'components/base/Result'
import { getRefreshTenant, setRefreshTenant } from 'reducers'

const POLLING_TIMEOUT = 10000 // 10 sec

interface ITenantConfigContext {
  client: Client
  leads: Lead[]
  masterdatas?: Masterdatas
  reload: (signal?: AbortSignal) => Promise<Client | undefined>
}

const TenantConfigContext = createContext<ITenantConfigContext>({
  client: { id: '', name: '', provider: '' },
  reload: async () => undefined,
  leads: [],
})

export const TenantConfigProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const clientRef = useRef<string>()
  const leadRef = useRef<string>()
  const to = useRef<NodeJS.Timeout>()
  const dispatch = useDispatch()

  const [initialized, setInitialized] = useState(false)
  const [client, setClient] = useState<Client>()
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState(false)
  const [masterdatas, setMasterdatas] = useState<Masterdatas>()
  const refresh = useSelector(getRefreshTenant)

  const loadMasterdatas = useCallback(async (md?: MasterdataLinks) => {
    if (md) {
      const newMasterData: Masterdatas = {}
      await Promise.all(
        Object.keys(md).map(async (key) => {
          newMasterData[key] = await fetch(md[key])
            .then((res) => res.json())
            .catch(logger.error)
        })
      )
      setMasterdatas(newMasterData)
    }
  }, [])

  const mapImageAssetUrls = useCallback(
    (data: Lead[]) =>
      data.map((d) => {
        const overrideImageLanguages = ['Th', 'En'].reduce(
          (prev, key) => ({
            ...prev,
            [`images${key}`]: d[`images${key}`]?.map(
              ({ directusFilesId: { id } }) =>
                `${env.TENANT_CONFIG_ASSETS_URL}/assets/${id}`
            ),
          }),
          {}
        )
        return { ...d, ...overrideImageLanguages }
      }),
    []
  )

  const reload = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const tenantData = await fetchTenantData(
          { _and: [{ name: findClientName() }, { is_sandbox: false }] },
          signal
        )

        const clientData = tenantData.data[0]
        if (!clientData) throw new Error('Client not found')

        const leadConfigData = await fetchLeadData(signal)

        if (
          JSON.stringify(tenantData) === clientRef.current &&
          JSON.stringify(leadConfigData) === leadRef.current
        ) {
          setInitialized(true)
          return
        }

        /** merge fetched data with defaultClient */
        clientData.backgroundCheckDashboardConfig = {
          ...defaultClient.backgroundCheckDashboardConfig,
          ...clientData.backgroundCheckDashboardConfig,
        }

        clientRef.current = JSON.stringify(clientData)
        leadRef.current = JSON.stringify(leadConfigData)

        setClient(clientData)

        const leadData = mapImageAssetUrls(leadConfigData.data)
        setLeads(leadData)

        setInitialized(true)
      } catch (err) {
        if (isAbortError(err)) return
        logger.error(err)
        if (!clientRef.current) setError(true)
      }
    },
    [mapImageAssetUrls]
  )

  useEffect(() => {
    if (!client) return
    const { masterdatas, translations } =
      client.backgroundCheckDashboardConfig ?? {}
    if (translations) overrideTranslations(translations)
    loadMasterdatas({
      ...defaultClient.backgroundCheckDashboardConfig?.masterdatas,
      ...masterdatas,
    })
  }, [client, loadMasterdatas])

  useEffect(() => {
    const theme = client?.theme
    if (theme) setTailwindTheme(theme)
  }, [client?.theme])

  useEffect(() => {
    if (initialized) return undefined
    const controller = new AbortController()

    const createTimeout = () => {
      to.current = setInterval(
        () => reload(controller.signal).catch(logger.error),
        POLLING_TIMEOUT
      )
    }

    reload(controller.signal)
      .then(createTimeout)
      .catch((err) => {
        if (isAbortError(err)) return
        if (!clientRef.current) setError(true)
        logger.error(err)
        createTimeout()
      })

    return () => {
      controller.abort()
      if (to.current) clearTimeout(to.current)
      to.current = undefined
    }
  }, [initialized, reload])

  useEffect(() => {
    dispatch(setRefreshTenant(false))
    if (refresh) reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  const value = useMemo(
    () => ({
      client,
      masterdatas,
      reload,
      leads,
    }),
    [client, leads, masterdatas, reload]
  )

  if (error)
    return (
      <FullScreen className="flex items-center justify-center">
        <Result
          faIcon={faExclamationCircle}
          title="Error"
          subTitle="Failed to fetch client data, please try again later"
        />
      </FullScreen>
    )

  if (!initialized)
    return <FullScreenLoading>Fetching client...</FullScreenLoading>

  return (
    <TenantConfigContext.Provider value={value as ITenantConfigContext}>
      {children}
    </TenantConfigContext.Provider>
  )
}

export const useTenantConfigContext = (): ITenantConfigContext =>
  useContext(TenantConfigContext)
