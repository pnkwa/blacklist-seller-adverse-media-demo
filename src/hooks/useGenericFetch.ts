import { useMemo } from 'react'
import { getSearchQuery, handleJsonResponse } from 'utils/fetch'
import { PaginationMeta } from 'types/generic'
import { FetchListService } from 'types/generic/fetch'
import { useAuthHeaders } from './useAuthHeaders'

export const useGenericFetch = (baseUrl: string, isSandbox = false) => {
  const { headers } = useAuthHeaders(isSandbox)

  const create = useMemo(
    () =>
      function <T, I = T>(path: string, method = 'POST') {
        return async (input: I): Promise<T> =>
          fetch(`${baseUrl}/${path}`, {
            method,
            body: input && JSON.stringify(input),
            headers,
          }).then(handleJsonResponse)
      },
    [headers, baseUrl]
  )

  const fetchList = useMemo(
    () =>
      function <T, M = PaginationMeta>(path: string): FetchListService<T, M> {
        return async (filter, order, page, limit, signal) =>
          fetch(
            `${baseUrl}/${path}?${getSearchQuery(filter, order, page, limit)}`,
            {
              method: 'GET',
              headers,
              signal,
            }
          ).then(handleJsonResponse)
      },
    [headers, baseUrl]
  )

  const fetchById = useMemo(
    () =>
      function <T, I = undefined>(path: string, method = 'GET') {
        return async (id: string, input?: I): Promise<T> =>
          fetch(`${baseUrl}/${path}/${id}`, {
            method,
            body: input && JSON.stringify(input),
            headers,
          }).then(handleJsonResponse)
      },
    [headers, baseUrl]
  )

  return { create, fetchList, fetchById }
}
