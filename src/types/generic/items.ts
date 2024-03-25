import { PaginationMeta } from './paginationMeta'

export interface ManyItems<T, M = PaginationMeta> {
  meta?: M
  data: T[]
}

export interface Filter {
  or?: Record<string, string>[]
  search?: string
  searchFields?: string | string[]
  [key: string]: string | string[] | any | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
}
