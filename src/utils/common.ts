/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unused-modules */
import hashMd5 from 'md5'
import moment from 'moment'
import { ApiError } from 'errors'
import { isRestrictCountry } from './validation'

export const isObject = (item) =>
  item &&
  typeof item === 'object' &&
  !Array.isArray(item) &&
  !moment.isDate(item)

export const range = (start, end) =>
  Array.from(
    Array((end || start * 2) - start).fill(null),
    (_, i) => i + (end ? start : 0)
  )

export const getAge = (value: string | undefined) => {
  if (!value) return 0
  const splitDate = value.split('-')
  const date = `${splitDate[0]}-${splitDate[1]?.replace(
    '00',
    '01'
  )}-${splitDate[2]?.replace('00', '01')}`

  if (splitDate?.find((t) => t === 'undefined')) return 0

  return moment().diff(date, 'years')
}

export const datesToISO = (dates: Date[]) => {
  return dates
    .map((date) => date.toISOString())
    .filter((x) => !!x)
    .join(',')
}

export const formatDateRange = (date: moment.MomentInput[]): [Date, Date] => [
  moment(date[0]).startOf('day').toDate(),
  moment(date[1]).endOf('day').toDate(),
]

export const permuteArray = <T>(arr: T[]): T[][] => {
  if (arr.length <= 1) return [arr]
  return arr.flatMap((element, index) =>
    permuteArray([...arr.slice(0, index), ...arr.slice(index + 1)]).map(
      (permutation) => [element, ...permutation]
    )
  )
}

export const removeKeys = (object: Record<string, unknown>, keys: string[]) => {
  const filterObj = { ...object }
  keys.map((key) => delete filterObj?.[key])
  return filterObj
}

export const deepAssign = (target, ...sources) => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key]) && source[key].constructor.name === 'Object') {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepAssign(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    })
  }

  return deepAssign(target, ...sources)
}

export const pick = (object, props: string[]) => {
  if (!object || typeof object !== 'object') return {}
  if (!props || !Array.isArray(props) || props.length === 0) return {}
  return props.reduce((acc, curr) => {
    acc[curr] = object[curr]
    return acc
  }, {})
}

export const isEmpty = (value) => {
  if (value == null) return true
  if (Array.isArray(value) || typeof value === 'string')
    return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const pathOr = (
  defaultValue: unknown,
  pathArray: (string | number)[],
  obj
) => {
  if (!Array.isArray(pathArray)) throw new Error('Path must be an array')

  let result = obj
  for (const value of pathArray) {
    if (result == null || typeof result !== 'object') return defaultValue
    result = result[value]
  }

  return result !== undefined ? result : defaultValue
}

export const sortByKey =
  (key: string, order: 'asc' | 'desc' = 'desc') =>
  (a, b) => {
    if (!a?.[key] || !b?.[key]) return 0

    const sortOrder = order === 'desc' ? 1 : -1

    if (a[key] > b[key]) return -1 * sortOrder
    if (a[key] < b[key]) return 1 * sortOrder
    return 0
  }

export const path = (pathArray: (string | number)[], obj) =>
  pathOr(undefined, pathArray, obj)

export const isNil = (value) => value === null || value === undefined

export const addConditionalSuffixes = (args: {
  value?: any
  formatValue?: (value) => any
  suffixes: ((value) => string | false | undefined)[]
}) => {
  const { value, formatValue = () => value, suffixes } = args
  if (!value) return null
  return [formatValue(value), ...suffixes.map((cond) => cond(value))]
    .filter((item) => item)
    .join('\n')
}

export const capitalizeFirstLetter = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const addNationalitySuffix = (
  value?: string | null,
  blacklist?: string[],
  displayValue?: string | null
) =>
  addConditionalSuffixes({
    value,
    formatValue: () => displayValue ?? value,
    suffixes: [
      (value) => isRestrictCountry(value, blacklist) && '(Restricted)',
    ],
  })

export const handleStatus = async (res: Response) => {
  if (res.status === 204) return res
  if (res.status >= 400) throw new ApiError(res, await res.json())
  if (/application\/json/.test(res.headers.get('content-type') ?? ''))
    return res.json()
  return res.body
}

export const replaceQuotesCSVField = (field: string) => {
  try {
    return JSON.parse(field.replace('“', '"').replace('”', '"'))
  } catch (e) {
    return field
  }
}

export const reduceObjValues = <T extends object>(
  obj: T,
  reductionFunc: (value: T[keyof T]) => void
) =>
  Object.entries(obj).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: reductionFunc(value),
    }),
    {} as T
  )

export const checkDuplicates = (list: any[]) => {
  const register: Record<string, boolean> = {}
  list.forEach((entry) => {
    const hash = hashMd5(JSON.stringify(entry)) // because object cannot be a record key
    if (register[hash]) register[hash] = false
    else if (register[hash] === undefined) register[hash] = true
  })
  const uniques = list.filter(
    (entry) => register[hashMd5(JSON.stringify(entry))]
  )
  const duplicates = list.filter(
    (entry) => !register[hashMd5(JSON.stringify(entry))]
  )
  return { duplicates, uniques }
}

export const removeFocus = () => {
  const dummyElement = document.createElement('button')
  dummyElement.setAttribute('tabindex', '-1')
  document.body.appendChild(dummyElement)
  dummyElement.focus()
  document.body.removeChild(dummyElement)
}

export const joinStringsWithJoiner = (
  values: string[],
  joiner: string,
  mapValue?: (value: string) => string
) => {
  const mapped = mapValue ? values.map(mapValue) : values
  if (mapped.length <= 1) return mapped.join()
  const lastItem = mapped.pop()
  return [mapped.join(','), lastItem].join(joiner)
}

export const getMiddleIndex = (arr: unknown[] | undefined) =>
  arr && Math.ceil(arr.length / 2)

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunkedArray: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size))
  }
  return chunkedArray
}
