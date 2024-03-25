import { ProprietorSearchFields } from 'types/tenantConfig'

export interface SearchableField {
  key: string
  label?: string
  tenantSearchField: ProprietorSearchFields
}

export const proprietorSearchableFieldConfigs: SearchableField[] = [
  {
    key: 'firstName',
    label: 'filters.searchFieldTooltip.labels.firstName',
    tenantSearchField: ProprietorSearchFields.NAME,
  },
  {
    key: 'middleName',
    tenantSearchField: ProprietorSearchFields.NAME,
  },
  {
    key: 'lastName',
    tenantSearchField: ProprietorSearchFields.NAME,
  },
  {
    key: 'citizenId',
    label: 'filters.searchFieldTooltip.labels.citizenId',
    tenantSearchField: ProprietorSearchFields.CITIZEN_ID,
  },
  {
    key: 'phoneNumber',
    label: 'filters.searchFieldTooltip.labels.phoneNumber',
    tenantSearchField: ProprietorSearchFields.CONTACT,
  },
  {
    key: 'email',
    label: 'filters.searchFieldTooltip.labels.email',
    tenantSearchField: ProprietorSearchFields.CONTACT,
  },
]
