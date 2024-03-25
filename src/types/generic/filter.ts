export enum FilterFieldType {
  DATE_RANGE_PICKER = 'dateRangePicker',
  CASE_TYPE_DROPDOWN = 'caseTypeDropdown',
  TAG_DROPDOWN = 'tagDropdown',
  TRANSACTION_RULE_DROPDOWN = 'transactionRuleDropdown',
}

export interface FilterFieldConfig {
  key: string
  filterKey?: string
  filterArgs?: string[]
  label: string
  fieldType: FilterFieldType
}
