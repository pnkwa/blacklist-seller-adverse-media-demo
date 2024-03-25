export type OrderDirection = 'ASC' | 'DESC'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Order<T = any> = {
  [key in keyof Partial<T>]: OrderDirection
}
