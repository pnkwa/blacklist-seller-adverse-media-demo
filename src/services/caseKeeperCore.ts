/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { env } from 'config/env'
import { BackgroundCheck, BackgroundCheckStatus } from 'types/bgcCore'
import { Flow, FlowInput, Verification } from 'types/caseKeeperCore'
import { Filter, ManyItems, PaginationMeta } from 'types/generic'
import { FetchByIdService, FetchListService } from 'types/generic/fetch'
import {
  getSearchQuery,
  handleJsonResponse,
  serializeURLParams,
} from 'utils/fetch'
import { getFlowIdentityQuery } from 'utils/flow'
import { Client } from 'types/tenantConfig'
import { Credit, CreditMeta } from 'types/exchange/credit'
import {
  ApplicationTransactionRule,
  Currency,
  Transaction,
  Wallet,
} from 'types/exchange/transaction'

// eslint-disable-next-line import/no-unused-modules
export interface CKCService {
  // fetch list
  fetchFlows: FetchListService<Flow>
  fetchFlowsGroupedByProprietor: FetchListService<Flow>
  fetchCredits: FetchListService<Credit>
  fetchTransactions: FetchListService<Transaction>
  fetchWallets: FetchListService<Wallet>
  fetchCurrencies: FetchListService<Currency>
  fetchApplicationTransactionRules: FetchListService<ApplicationTransactionRule>

  // fetch by id
  fetchFlowById: FetchByIdService<Flow>
  fetchVerificationById: FetchByIdService<Verification>
  fetchBackgroundCheckById: FetchByIdService<BackgroundCheck>

  // create
  createFlow: (input: FlowInput) => Promise<Flow>
  createFlows: (input: FlowInput[]) => Promise<ManyItems<Flow>>

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
}

/**
 * returns a base api instance for making basic REST api requests to mac-background-check-core service.
 * this does not include any business logics.
 * for business logics related function, use `createBGC`
 */
// eslint-disable-next-line import/no-unused-modules
export const createCKCInstance = (token: string | undefined) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })
  const baseUrl = env.CASE_KEEPER_CORE_URL

  const create =
    <T, I = T>(path: string, method = 'POST') =>
    async (input: I): Promise<T> =>
      fetch(`${baseUrl}/${path}`, {
        method,
        body: input && JSON.stringify(input),
        headers,
      }).then(handleJsonResponse)

  const createByFormData =
    <T>(path: string, method = 'POST') =>
    async (input: FormData): Promise<T> =>
      fetch(`${baseUrl}/${path}`, {
        method,
        body: input,
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }).then(handleJsonResponse)

  const fetchList =
    <T, M = PaginationMeta>(path: string): FetchListService<T, M> =>
    async (filter, order, page, limit, signal) =>
      fetch(
        `${baseUrl}/${path}?${getSearchQuery(filter, order, page, limit)}`,
        {
          method: 'GET',
          headers,
          signal,
        }
      ).then(handleJsonResponse)

  const fetchById =
    <T, I = undefined>(path: string, method = 'GET') =>
    async (id: string, input?: I): Promise<T> =>
      fetch(`${baseUrl}/${path}/${id}`, {
        method,
        body: input && JSON.stringify(input),
        headers,
      }).then(handleJsonResponse)

  const fetchDuplicate = <T>(path: string, method = 'GET'): Promise<T> =>
    fetch(`${baseUrl}/${path}`, {
      method,
      headers,
    })
      .then(handleJsonResponse)
      .then(({ data }) => data)

  return { create, createByFormData, fetchDuplicate, fetchList, fetchById }
}

/**
 * returns API services to integrate with mac-background-check-core service.
 *
 * Contains functions to do CRUD on each background check processes
 */
export const createCKCService = (token: string | undefined): CKCService => {
  const { create, createByFormData, fetchDuplicate, fetchList, fetchById } =
    createCKCInstance(token)

  return {
    // fetch
    fetchFlows: fetchList<Flow>('flows'),
    fetchFlowsGroupedByProprietor: fetchList<Flow>('flows/proprietors'),
    fetchCredits: fetchList<Credit, CreditMeta>('stats/credits'),
    fetchTransactions: fetchList<Transaction>('exchanges/transactions'),
    fetchWallets: fetchList<Wallet>('exchanges/wallets'),
    fetchCurrencies: fetchList<Currency>('exchanges/currencies'),
    fetchApplicationTransactionRules: fetchList<ApplicationTransactionRule>(
      'exchanges/applicationTransactionRules'
    ),

    // fetch by ID
    fetchFlowById: fetchById<Flow>('flows'),
    fetchVerificationById: fetchById<Verification>('verifications'),
    fetchBackgroundCheckById: fetchById<BackgroundCheck>('backgroundChecks'),

    // create
    createFlow: create<any, FlowInput | FlowInput[]>('flows'),
    createFlows: create<any, FlowInput | FlowInput[]>('flows'),

    // update
    updateBackgroundCheck: fetchById<BackgroundCheck, Partial<BackgroundCheck>>(
      'backgroundChecks',
      'PATCH'
    ),
    updateFlow: fetchById<Flow, Partial<Flow>>('flows', 'PATCH'),

    updateClientConfig: createByFormData<Client>('clients', 'PATCH'),

    // delete
    deleteFlow: fetchById<Response | undefined>('flows', 'DELETE'),

    findDuplicateFlow: (inputs: FlowInput[]) => {
      const {
        UNSPECIFIED,
        OPEN,
        BLOCKED,
        PENDING_CLIENT,
        PENDING_OPERATION,
        UNVERIFIABLE,
        COMPLETED,
        VERIFIED,
        REJECTED,
        EXPIRED,
      } = BackgroundCheckStatus
      const currentDate = moment().toISOString()
      const query = getFlowIdentityQuery(inputs)
      const filter: Filter = {
        or: query.flatMap((q) => [
          {
            ...q,
            'backgroundCheck-expiresAt-$moreThan': currentDate,
            'backgroundCheck-status-$in': [OPEN, PENDING_CLIENT].join(','),
          },
          {
            ...q,
            'backgroundCheck-status-$in': [
              UNSPECIFIED,
              BLOCKED,
              PENDING_OPERATION,
              UNVERIFIABLE,
              COMPLETED,
              VERIFIED,
              REJECTED,
              EXPIRED,
            ].join(','),
          },
        ]),
      }
      const serializedQuery = serializeURLParams(filter)

      return fetchDuplicate<Flow[]>(`flows?${serializedQuery}`)
    },
  }
}
