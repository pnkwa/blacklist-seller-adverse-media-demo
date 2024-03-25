import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useKeycloak } from '@react-keycloak/web'
import moment from 'moment'
import { downloadBlobResponse } from 'utils/file'
import { BackgroundCheck } from 'types/bgcCore'
import {
  ClientModel,
  Event,
  Flow,
  FlowInput,
  Permission,
  User,
  Verification,
} from 'types/caseKeeperCore'
import { FetchByIdService, FetchListService } from 'types/generic/fetch'
import { useGenericFetch } from 'hooks/useGenericFetch'
import { env } from 'config/env'
import { dateFormats } from 'config/dateFormats'
import { NotificationQuery } from 'types/kycCore'
import { handleArrayBufferResponse, handleJsonResponse } from 'utils/fetch'
import { useAuthHeaders } from 'hooks/useAuthHeaders'
import { createCKCService } from 'services/caseKeeperCore'
import { ManyItems } from 'types/generic'
import { Client } from 'types/tenantConfig'
import { Credit } from 'types/exchange/credit'
import {
  ApplicationTransactionRule,
  Currency,
  Transaction,
  Wallet,
} from 'types/exchange/transaction'

interface ICaseKeeperContext {
  permissions: Permission[] | undefined
  userInfo: User | undefined

  // fetch list
  fetchEvents: FetchListService<Event>
  fetchFlows: FetchListService<Flow>
  fetchFlowsGroupedByProprietor: FetchListService<Flow>
  fetchUserClient: FetchListService<ClientModel>
  fetchCredits: FetchListService<Credit>
  fetchCurrencies: FetchListService<Currency>
  fetchTransactions: FetchListService<Transaction>
  fetchWallets: FetchListService<Wallet>
  fetchApplicationTransactionRules: FetchListService<ApplicationTransactionRule>

  // fetch by id
  fetchFlowById: FetchByIdService<Flow>
  fetchVerificationById: FetchByIdService<Verification>
  fetchBackgroundCheckById: FetchByIdService<BackgroundCheck>
  fetchUserById: FetchByIdService<User>

  // create
  createFlow: (input: FlowInput) => Promise<Flow>
  createFlows: (input: FlowInput[]) => Promise<ManyItems<Flow>>
  sendNotification: (flowId: string, query: NotificationQuery) => Promise<void>

  // update
  updateBackgroundCheck: (
    id: string,
    input: Partial<BackgroundCheck>
  ) => Promise<BackgroundCheck>
  updateFlow: (flowId: string, input: Partial<Flow>) => Promise<Flow>
  updateClientConfig: (input: FormData) => Promise<Client>

  // delete
  deleteFlow: (flowId: string) => Promise<Response | undefined>

  findDuplicateFlow: (inputs: FlowInput[]) => Promise<Flow[]>
  // download documents
  downloadZip: (
    id: string,
    fileName?: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any
  ) => Promise<void>

  downloadSummaryReport: (id: string) => Promise<ArrayBuffer>
  generateLead: (featureName: string) => Promise<void>
  bulkDownloadZip: (
    flowIds?: string[],
    flowId?: string,
    password?: string
  ) => Promise<void>
}

const unimplemented = async () => {
  throw new Error('not in context')
}

const defaultCaseKeeperContextValue: ICaseKeeperContext = {
  permissions: undefined,
  userInfo: undefined,
  fetchBackgroundCheckById: unimplemented,
  fetchEvents: unimplemented,
  fetchCredits: unimplemented,
  fetchCurrencies: unimplemented,
  fetchWallets: unimplemented,
  fetchTransactions: unimplemented,
  fetchApplicationTransactionRules: unimplemented,
  fetchFlowById: unimplemented,
  fetchFlows: unimplemented,
  fetchFlowsGroupedByProprietor: unimplemented,
  createFlow: unimplemented,
  createFlows: unimplemented,
  downloadZip: unimplemented,
  downloadSummaryReport: unimplemented,
  fetchUserById: unimplemented,
  fetchUserClient: unimplemented,
  fetchVerificationById: unimplemented,
  sendNotification: unimplemented,
  updateBackgroundCheck: unimplemented,
  updateFlow: unimplemented,
  deleteFlow: unimplemented,
  findDuplicateFlow: unimplemented,
  updateClientConfig: unimplemented,
  generateLead: unimplemented,
  bulkDownloadZip: unimplemented,
}

const CaseKeeperContext = createContext<ICaseKeeperContext>(
  defaultCaseKeeperContextValue
)

export const CaseKeeperProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { keycloak } = useKeycloak()
  const { headers } = useAuthHeaders(false)
  const { fetchList, fetchById } = useGenericFetch(env.CASE_KEEPER_CORE_URL)

  const {
    fetchCredits,
    fetchWallets,
    fetchTransactions,
    fetchApplicationTransactionRules,
    fetchCurrencies,
    fetchFlows,
    fetchFlowById,
    fetchFlowsGroupedByProprietor,
    fetchVerificationById,
    fetchBackgroundCheckById,
    createFlow,
    createFlows,
    updateBackgroundCheck,
    updateFlow,
    deleteFlow,
    findDuplicateFlow,
    updateClientConfig,
  } = useMemo(() => createCKCService(keycloak.token), [keycloak.token])

  const [permissions, setPermissions] = useState<Permission[] | undefined>()
  const [userInfo, setUserInfo] = useState<User | undefined>()

  const fetchEvents = useMemo(() => fetchList<Event>('events'), [fetchList])

  const fetchUserClient = useMemo(
    () => fetchList<ClientModel>('clients'),
    [fetchList]
  )

  const fetchUserById = useMemo(() => fetchById<User>('users'), [fetchById])

  const sendNotification: ICaseKeeperContext['sendNotification'] = useCallback(
    async (flowId: string, queryObj: NotificationQuery) => {
      const query = new URLSearchParams()
      Object.keys(queryObj).forEach((key) => {
        if (queryObj?.[key]) query.set(key, queryObj?.[key])
      })
      return fetch(
        `${env.CASE_KEEPER_CORE_URL}/flows/${flowId}/notification?${query}`,
        { method: 'POST', headers }
      ).then(handleJsonResponse)
    },
    [headers]
  )

  const downloadZip = useCallback(
    async (id: string, fileName?: string | null, body?) =>
      fetch(`${env.CASE_KEEPER_CORE_URL}/flows/${id}/zip`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
      }).then(
        downloadBlobResponse(
          `${moment().format(dateFormats.compactISODate)}_${fileName}.zip`
        )
      ),
    [headers]
  )

  const downloadSummaryReport = useCallback(
    async (id: string) =>
      fetch(`${env.CASE_KEEPER_CORE_URL}/flows/${id}/summary-report`, {
        method: 'POST',
        headers,
      }).then(handleArrayBufferResponse),
    [headers]
  )

  const generateLead = useCallback(
    async (featureName: string) =>
      fetch(`${env.CASE_KEEPER_CORE_URL}/generate-lead`, {
        method: 'POST',
        body: JSON.stringify({ featureName }),
        headers,
      }).then(handleJsonResponse),
    [headers]
  )

  const bulkDownloadZip = useCallback(
    async (flowIds?: string[], password?: string) => {
      await fetch(`${env.CASE_KEEPER_CORE_URL}/flows/zip/bulk`, {
        method: 'POST',
        body: JSON.stringify({ flowIds, password }),
        headers,
      }).then(handleJsonResponse)
    },
    [headers]
  )

  useEffect(() => {
    const sub = keycloak.idTokenParsed?.sub
    if (!sub) return
    fetchUserById(sub).then((response) => {
      setUserInfo(response)
      if (response?.role?.permissions) setPermissions(response.role.permissions)
    })
  }, [fetchUserById]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({
      createFlow,
      createFlows,
      downloadZip,
      downloadSummaryReport,
      userInfo,
      permissions,
      fetchEvents,
      fetchCredits,
      fetchCurrencies,
      fetchWallets,
      fetchTransactions,
      fetchApplicationTransactionRules,
      fetchFlows,
      fetchFlowsGroupedByProprietor,
      fetchUserClient,
      fetchFlowById,
      fetchVerificationById,
      fetchBackgroundCheckById,
      fetchUserById,
      sendNotification,
      updateBackgroundCheck,
      updateFlow,
      deleteFlow,
      findDuplicateFlow,
      updateClientConfig,
      generateLead,
      bulkDownloadZip,
    }),
    [
      createFlow,
      createFlows,
      downloadZip,
      downloadSummaryReport,
      userInfo,
      permissions,
      fetchEvents,
      fetchCredits,
      fetchCurrencies,
      fetchWallets,
      fetchTransactions,
      fetchApplicationTransactionRules,
      fetchFlows,
      fetchFlowsGroupedByProprietor,
      fetchUserClient,
      fetchFlowById,
      fetchVerificationById,
      fetchBackgroundCheckById,
      fetchUserById,
      sendNotification,
      updateBackgroundCheck,
      updateFlow,
      deleteFlow,
      findDuplicateFlow,
      updateClientConfig,
      generateLead,
      bulkDownloadZip,
    ]
  )

  return (
    <CaseKeeperContext.Provider value={value}>
      {children}
    </CaseKeeperContext.Provider>
  )
}

export const useCaseKeeperContext = (): ICaseKeeperContext =>
  useContext(CaseKeeperContext)
