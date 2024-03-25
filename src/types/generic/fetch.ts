import { Filter, ManyItems, Order, PaginationMeta } from '.'

export type FetchListService<T, M = PaginationMeta> = (
  filter?: Filter,
  order?: Order<T>,
  page?: number,
  limit?: number | 'unlimited',
  signal?: AbortSignal
) => Promise<ManyItems<T, M>>

export type FetchByIdService<T> = (id: string) => Promise<T>
