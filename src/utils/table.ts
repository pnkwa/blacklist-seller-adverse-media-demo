import { Flow } from 'types/caseKeeperCore'
import { TableSpec } from 'types/generic/table'

export const filterColumns = (
  columns: TableSpec<Flow>[],
  configs: string[] | undefined
) => columns.filter((item) => configs?.includes(item.key))
