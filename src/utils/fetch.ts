import { ApiError } from 'errors'
import { Filter, Order } from 'types/generic'
import { FETCH_LIST_LIMIT } from 'config/pagination'
import { FetchListService } from 'types/generic/fetch'
import { deepAssign } from './common'

export const handleJsonResponse = async (res: Response) => {
  if (res.status === 204) return res
  if (res.status >= 400) throw new Error(await res.json())
  if (/application\/json/.test(res.headers.get('content-type') ?? ''))
    return res.json()
  return res.body
}

export const handleArrayBufferResponse = async (res: Response) => {
  if (res.status === 200) return res.arrayBuffer()
  throw new ApiError(res, await res.json().catch(() => res))
}

export const serializeURLParams = (obj, prefix?: string): string => {
  const str: string[] = []
  Object.keys(obj).forEach((key) => {
    const id = prefix ? `${prefix}[${key}]` : key
    const val = obj[key]
    if (val !== undefined)
      str.push(
        val !== null && typeof val === 'object' && val.constructor !== Date
          ? serializeURLParams(val, id)
          : `${encodeURIComponent(id)}=${encodeURIComponent(val)}`
      )
  })
  return str.join('&')
}

export const getSearchQuery = <T>(
  filter?: Filter,
  order?: Order<T>,
  page?: number,
  limit?: number | 'unlimited'
): string => {
  const query = {}
  if (page) {
    deepAssign(query, { limit: String(limit ?? FETCH_LIST_LIMIT) })
    deepAssign(query, { page: String(page) })
  }
  if (order) {
    const value = Object.keys(order)
      .map((key) => `${key}-${order[key]}`)
      .join(',')
    deepAssign(query, { order: value })
  }
  if (filter) deepAssign(query, filter)
  return serializeURLParams(query)
}

const fetchPage = <T>(
  fetchFunction,
  {
    filter,
    order,
    signal,
  }: {
    filter?: Filter
    order?: Order<T>
    signal?: AbortSignal
  }
) => {
  return fetchFunction(filter, order, undefined, signal).catch((error) => {
    if (error.status === '504')
      return fetchPage(fetchFunction, { filter, order, signal })

    throw new Error(error)
  })
}

export const fetchAllPages = async <T>(
  fetchFunction: FetchListService<T>,
  filter?: Filter,
  order?: Order<T>,
  signal?: AbortSignal
): Promise<T[]> => {
  let currentPage = 1
  const results: T[] = []
  const { meta, data } = await fetchPage(fetchFunction, {
    filter: { ...filter, page: currentPage } as Filter,
    order,
    signal,
  })
  results.push(...data)

  if (meta?.count && meta?.limit) {
    const totalPage = Math.ceil(meta.count / meta.limit)

    while (totalPage > currentPage) {
      currentPage += 1
      // eslint-disable-next-line no-await-in-loop
      const { data } = await fetchPage(fetchFunction, {
        filter: { ...filter, page: currentPage },
        order,
        signal,
      })
      results.push(...data)
    }
  }
  return results
}
