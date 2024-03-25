import {
  DateRangePickerValues,
  Filter,
  FilterFieldConfig,
  FilterFieldType,
} from 'types/generic'
import { SearchableField } from 'config/searchFields'
import { Client, ProprietorSearchFields } from 'types/tenantConfig'
import {
  DashboardFilterFieldConfig,
  transactionFilterFieldConfigs,
} from 'config/filter'
import { Currency } from 'types/exchange/transaction'
import { datesToISO, formatDateRange, permuteArray } from './common'
import { ENGLISH_ALPHABET } from './regex'

const getSearchNameQuery = (
  key: string,
  value: string
): Record<string, string> => {
  const language = ENGLISH_ALPHABET.test(value) ? 'EN' : 'TH'
  return {
    [`backgroundCheck-verificationInfo-$jsonLike-${key}${language}`]: value,
  }
}

export const getSearchedQuery = (
  search: string,
  fields: string[],
  searchableFieldConfigs: SearchableField[]
) => {
  const trimmedValue = search.trim().replace(/\s+/g, ' ')
  const or: Record<string, string>[] = searchableFieldConfigs.map(
    ({ key, tenantSearchField }) => {
      if (tenantSearchField === ProprietorSearchFields.NAME)
        return getSearchNameQuery(key, search)
      if (tenantSearchField === ProprietorSearchFields.CITIZEN_ID)
        return {
          [`backgroundCheck-verificationInfo-$jsonLike-${key}`]: search,
        }
      return {
        [`proprietor-${key}-$like`]: search,
      }
    }
  )

  /** search for full name when the text has empty spaces */
  const searchFieldKeys = fields?.includes(ProprietorSearchFields.NAME)

  if (searchFieldKeys && trimmedValue.includes(' ')) {
    const values = trimmedValue.split(' ')
    const keys = ['firstName', 'middleName', 'lastName']
    const permutedKeys = permuteArray(keys)
    permutedKeys.forEach((ks) => {
      or.push(
        ks.reduce(
          (acc, curr, index) => ({
            ...acc,
            ...getSearchNameQuery(curr, values[index]),
          }),
          {}
        )
      )
    })
  }

  return or
}

export const getDateRangeQuery = (filterArgs, dates: DateRangePickerValues) => {
  if (dates?.length !== 2 || !filterArgs.length) return {}
  const values = datesToISO(formatDateRange(dates))

  return filterArgs.reduce((result, current) => {
    return { ...result, [current]: values }
  }, {})
}

const getConditionFilter = (
  key: string,
  config?: FilterFieldConfig,
  filter: Filter = {}
): Record<string, unknown> => {
  switch (config?.fieldType) {
    case FilterFieldType.DATE_RANGE_PICKER:
      return getDateRangeQuery(config?.filterArgs, filter[key])
    case FilterFieldType.CASE_TYPE_DROPDOWN:
      return {
        'backgroundCheck-verificationInfo-$jsonNestedEq-position-key':
          filter[key],
      }
    case FilterFieldType.TAG_DROPDOWN:
      return filter?.tagOperator === 'notContain'
        ? { 'tags-$not-$overlaps': filter[key] }
        : { 'tags-$overlaps': filter[key] }
    default:
      return {}
  }
}

export const getQueryParamsFilter = (
  client: Client,
  dashboardFilterFieldConfig: DashboardFilterFieldConfig,
  searchableFieldConfigs: SearchableField[],
  { filter = {}, searched = '' } = {}
) => {
  const filteredFields =
    dashboardFilterFieldConfig.getFilterFieldConfigs &&
    dashboardFilterFieldConfig?.getFilterFieldConfigs(client)
  const searchedFields =
    dashboardFilterFieldConfig.getSearchFieldKeys &&
    dashboardFilterFieldConfig?.getSearchFieldKeys(client)
  const filteredFieldsMaps = new Map(
    filteredFields?.map((field) => [field.key, field])
  )

  const filterQuery = Object.keys(filter).reduce((filtered, key) => {
    return {
      ...filtered,
      ...getConditionFilter(key, filteredFieldsMaps.get(key), filter),
    }
  }, {})

  const searchQuery =
    searchedFields &&
    searched &&
    getSearchedQuery(searched, searchedFields, searchableFieldConfigs)

  return {
    'proprietorId-$not-$isNull': '',
    ...(searchQuery && { or: searchQuery }),
    ...filterQuery,
  }
}

export const getTransactionQueryParamsFilter = (
  currentTransactionTab: Currency,
  filter = {}
) => {
  const filteredFieldsMaps = new Map(
    transactionFilterFieldConfigs?.map((field) => [field.key, field])
  )
  const filterQuery = Object.keys(filter).reduce(
    (filtered, key) => ({
      ...filtered,
      ...getConditionFilter(key, filteredFieldsMaps.get(key), filter),
    }),
    {}
  )

  return {
    'id-$not-$isNull': '',
    'currencyId-$eq': currentTransactionTab.id,
    ...filterQuery,
  }
}
