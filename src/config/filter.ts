import { FlowsResultKey } from 'types/caseKeeperCore'
import { FilterFieldConfig, FilterFieldType, Masterdata } from 'types/generic'
import { Client } from 'types/tenantConfig'

const completedAtField: FilterFieldConfig = {
  key: 'backgroundCheck.completedAt',
  filterKey: 'backgroundCheck.completedAt',
  filterArgs: [`backgroundCheck-completedAt-$between`],
  label: 'filters.completedAt',
  fieldType: FilterFieldType.DATE_RANGE_PICKER,
}

const tagField: FilterFieldConfig = {
  key: 'tags',
  label: 'filters.tags',
  fieldType: FilterFieldType.TAG_DROPDOWN,
}

const caseTypeField: FilterFieldConfig = {
  key: 'backgroundCheck.verificationInfo.position',
  label: 'filters.positions',
  fieldType: FilterFieldType.CASE_TYPE_DROPDOWN,
}

const filterFieldConfigs: FilterFieldConfig[] = [
  completedAtField,
  caseTypeField,
  tagField,
]

export interface DashboardFilterFieldConfig {
  key: FlowsResultKey
  getSearchFieldKeys: (client: Client) => string[] | undefined
  getFilterFieldConfigs: (client: Client) => FilterFieldConfig[] | undefined
}

const filterFields = (
  fieldConfigs: FilterFieldConfig[],
  tenantFilterOptions?: string[]
) => fieldConfigs?.filter((item) => tenantFilterOptions?.includes(item.key))

export const dashboardFilterFieldConfig: DashboardFilterFieldConfig[] = [
  {
    key: FlowsResultKey.ALL,
    getSearchFieldKeys: (client) =>
      client?.backgroundCheckDashboardConfig?.totalCaseFlowSearchFields,
    getFilterFieldConfigs: (client) =>
      filterFields(
        filterFieldConfigs,
        client.backgroundCheckDashboardConfig?.totalCaseFlowFilterOptions
      ),
  },
  {
    key: FlowsResultKey.PENDING_CLIENT,
    getSearchFieldKeys: (client) =>
      client?.backgroundCheckDashboardConfig?.pendingClientFlowSearchFields,
    getFilterFieldConfigs: (client) =>
      filterFields(
        filterFieldConfigs,
        client.backgroundCheckDashboardConfig
          ?.pendingClientCaseFlowFilterOptions
      ),
  },
  {
    key: FlowsResultKey.BLOCKED,
    getSearchFieldKeys: (client) =>
      client?.backgroundCheckDashboardConfig?.kycNotVerifiedFlowSearchFields,
    getFilterFieldConfigs: (client) =>
      filterFields(
        filterFieldConfigs,
        client.backgroundCheckDashboardConfig?.kycNotVerifiedFlowFilterOptions
      ),
  },
  {
    key: FlowsResultKey.PENDING_OPERATION,
    getSearchFieldKeys: (client) =>
      client?.backgroundCheckDashboardConfig?.pendingResultFlowSearchFields,
    getFilterFieldConfigs: (client) =>
      filterFields(
        filterFieldConfigs,
        client.backgroundCheckDashboardConfig?.pendingResultFlowFilterOptions
      ),
  },
  {
    key: FlowsResultKey.RECEIVED,
    getSearchFieldKeys: (client) =>
      client?.backgroundCheckDashboardConfig?.receivedResultFlowSearchFields,
    getFilterFieldConfigs: (client) =>
      filterFields(
        filterFieldConfigs,
        client.backgroundCheckDashboardConfig?.receivedResultFlowFilterOptions
      ),
  },
]

export const tagOptions: Masterdata[] = [
  {
    key: 'contain',
    translations: { en: 'Contain', th: 'มี' },
  },
  {
    key: 'notContain',
    translations: { en: 'Not contain', th: 'ไม่มี' },
  },
]

export const transactionFilterFieldConfigs: FilterFieldConfig[] = [
  {
    key: 'dateTime',
    filterKey: 'enabled',
    filterArgs: ['createdAt-$between'],
    label: 'tableHead.dateTime',
    fieldType: FilterFieldType.DATE_RANGE_PICKER,
  },
  {
    key: 'transactionRuleId',
    filterKey: 'enabled',
    label: 'tableHead.transactionType',
    fieldType: FilterFieldType.TRANSACTION_RULE_DROPDOWN,
  },
]
