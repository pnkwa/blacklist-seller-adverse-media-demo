import { DashboardFilterFieldConfig } from 'config/filter'
import { SearchableField } from 'config/searchFields'
import { Client, ProprietorSearchFields } from 'types/tenantConfig'
import { DateRangePickerValues } from 'types/generic'
import { FlowsResultKey } from 'types/caseKeeperCore'
import {
  getSearchedQuery,
  getDateRangeQuery,
  getQueryParamsFilter,
} from './dashboardFilter'

describe('getSearchedQuery', () => {
  const searchableFields: SearchableField[] = [
    {
      key: ProprietorSearchFields.NAME,
      label: 'Name',
      tenantSearchField: ProprietorSearchFields.NAME,
    },
    {
      key: ProprietorSearchFields.CITIZEN_ID,
      label: 'Citizen ID',
      tenantSearchField: ProprietorSearchFields.CITIZEN_ID,
    },
    {
      key: ProprietorSearchFields.CONTACT,
      label: 'Contact',
      tenantSearchField: ProprietorSearchFields.CONTACT,
    },
  ]

  it('should return query with "backgroundCheck-verificationInfo-$jsonLike-nameEN" when searching by name field', () => {
    const search = 'John'
    const fields = [ProprietorSearchFields.NAME]
    const query = getSearchedQuery(search, fields, searchableFields)
    expect(query).toEqual([
      { 'backgroundCheck-verificationInfo-$jsonLike-nameEN': 'John' },
      { 'backgroundCheck-verificationInfo-$jsonLike-citizenId': 'John' },
      { 'proprietor-contact-$like': 'John' },
    ])
  })

  it('should return query with "backgroundCheck-verificationInfo-$jsonLike-firstNameEN" and "backgroundCheck-verificationInfo-$jsonLike-lastNameEN" when searching by full name field', () => {
    const search = 'john wick'
    const fields = [ProprietorSearchFields.NAME]
    const query = getSearchedQuery(search, fields, searchableFields)
    expect(query).toEqual([
      { 'backgroundCheck-verificationInfo-$jsonLike-nameEN': 'john wick' },
      { 'backgroundCheck-verificationInfo-$jsonLike-citizenId': 'john wick' },
      { 'proprietor-contact-$like': 'john wick' },
      {
        'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'john',
        'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': undefined,
        'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'wick',
      },
      {
        'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'john',
        'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'wick',
        'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': undefined,
      },
      {
        'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'wick',
        'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': undefined,
        'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'john',
      },
      {
        'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': undefined,
        'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'wick',
        'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'john',
      },
      {
        'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'wick',
        'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'john',
        'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': undefined,
      },
      {
        'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': undefined,
        'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'john',
        'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'wick',
      },
    ])
  })

  it('should return query with "backgroundCheck-verificationInfo-$jsonLike-firstNameEN" when searching by first name', () => {
    const search = 'John'
    const fields = [ProprietorSearchFields.NAME]
    const query = getSearchedQuery(search, fields, searchableFields)
    expect(query).toEqual([
      { 'backgroundCheck-verificationInfo-$jsonLike-nameEN': 'John' },
      { 'backgroundCheck-verificationInfo-$jsonLike-citizenId': 'John' },
      { 'proprietor-contact-$like': 'John' },
    ])
  })

  it('should return query with "backgroundCheck-verificationInfo-$jsonLike-lastNameEN" when searching by last name', () => {
    const search = 'wick'
    const fields = [ProprietorSearchFields.NAME]
    const query = getSearchedQuery(search, fields, searchableFields)
    expect(query).toEqual([
      { 'backgroundCheck-verificationInfo-$jsonLike-nameEN': 'wick' },
      { 'backgroundCheck-verificationInfo-$jsonLike-citizenId': 'wick' },
      { 'proprietor-contact-$like': 'wick' },
    ])
  })
})

describe('getDateRangeQuery', () => {
  it('returns empty object if filterArgs or dates are empty', () => {
    expect(getDateRangeQuery([], [new Date(), null])).toEqual({})
    expect(
      getDateRangeQuery(
        ['verification-createdAt-$between'],
        [] as unknown as DateRangePickerValues
      )
    ).toEqual({})
    expect(
      getDateRangeQuery([], [] as unknown as DateRangePickerValues)
    ).toEqual({})
  })

  it('returns query object with correct date range values', () => {
    const dates: DateRangePickerValues = [
      new Date('2022-01-01'),
      new Date('2022-01-31'),
    ]

    const filterArgs = ['verification-createdAt-$between']
    const expectedQuery = {
      'verification-createdAt-$between':
        '2021-12-31T17:00:00.000Z,2022-01-31T16:59:59.999Z',
    }
    expect(getDateRangeQuery(filterArgs, dates)).toEqual(expectedQuery)
  })
})

describe('getSearchedQuery', () => {
  const filterOption = {
    filter: {
      'verification.createdAt': [
        '2023-02-28T17:00:00.000Z',
        '2023-03-03T16:59:59.999Z',
      ],
      'verification.kycStatus': 'open',
    },
    searched: 'John wick',
  }

  const bgcTabConfig = {
    key: FlowsResultKey.ALL,
    getSearchFieldKeys: () => ['name', 'citizenId', 'contact'],
    getFilterFieldConfigs: () => [
      {
        key: 'backgroundCheck.processCompletedAt',
        filterArgs: ['backgroundCheck-kycVerifiedAt-$between'],
        label: 'backgroundCheck.completedAt',
        fieldType: 'dateRangePicker',
      },
    ],
  }

  const client = {
    id: 'AppMan',
    backgroundCheckDashboardConfig: {
      allFlowProprietorSearchFields: ['name', 'citizenId', 'contact'],
      allFlowFilterOptions: [
        'proprietor.search',
        'backgroundCheck.completedAt',
        'backgroundCheck.verificationInfo.position',
      ],
    },
  }

  const searchableFieldConfigs = [
    {
      key: 'firstName',
      label: 'dashboard.searchFieldTooltip.labels.firstName',
      tenantSearchField: 'name',
    },
    {
      key: 'lastName',
      label: 'dashboard.searchFieldTooltip.labels.lastName',
      tenantSearchField: 'name',
    },
    {
      key: 'citizenId',
      label: 'dashboard.searchFieldTooltip.labels.citizenId',
      tenantSearchField: 'citizenId',
    },
    {
      key: 'phoneNumber',
      label: 'dashboard.searchFieldTooltip.labels.phoneNumber',
      tenantSearchField: 'contact',
    },
    {
      key: 'email',
      label: 'dashboard.searchFieldTooltip.labels.email',
      tenantSearchField: 'contact',
    },
  ]

  it('returns default value object if filterOption, client, dashboardTableTabConfig or searchableFieldConfigs are empty', () => {
    const defaultValue = {
      'proprietorId-$not-$isNull': '',
    }
    expect(
      getQueryParamsFilter(
        {} as Client,
        {} as DashboardFilterFieldConfig,
        [] as SearchableField[],
        filterOption
      )
    ).toEqual(defaultValue)
    expect(
      getQueryParamsFilter(
        client as Client,
        {} as DashboardFilterFieldConfig,
        [] as SearchableField[],
        {}
      )
    ).toEqual(defaultValue)
    expect(
      getQueryParamsFilter(
        {} as Client,
        bgcTabConfig as unknown as DashboardFilterFieldConfig,
        [] as SearchableField[],
        {}
      )
    ).toEqual(defaultValue)
    expect(
      getQueryParamsFilter(
        {} as Client,
        {} as DashboardFilterFieldConfig,
        searchableFieldConfigs as SearchableField[],
        {}
      )
    ).toEqual(defaultValue)
  })

  it('returns query object with correct query params filter', () => {
    const queryParamsFilter = {
      'proprietorId-$not-$isNull': '',
      or: [
        {
          'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'John wick',
        },
        {
          'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'John wick',
        },
        { 'backgroundCheck-verificationInfo-$jsonLike-citizenId': 'John wick' },
        { 'proprietor-phoneNumber-$like': 'John wick' },
        { 'proprietor-email-$like': 'John wick' },
        {
          'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'John',
          'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'wick',
          'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': undefined,
        },
        {
          'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'John',
          'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'wick',
          'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': undefined,
        },
        {
          'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'wick',
          'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': undefined,
          'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'John',
        },
        {
          'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': undefined,
          'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'wick',
          'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'John',
        },
        {
          'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': 'wick',
          'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'John',
          'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': undefined,
        },
        {
          'backgroundCheck-verificationInfo-$jsonLike-firstNameEN': undefined,
          'backgroundCheck-verificationInfo-$jsonLike-lastNameEN': 'John',
          'backgroundCheck-verificationInfo-$jsonLike-middleNameEN': 'wick',
        },
      ],
    }

    expect(
      getQueryParamsFilter(
        client as Client,
        bgcTabConfig as unknown as DashboardFilterFieldConfig,
        searchableFieldConfigs as SearchableField[],
        filterOption
      )
    ).toEqual(queryParamsFilter)
  })
})
