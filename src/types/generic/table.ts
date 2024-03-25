/* eslint-disable import/no-unused-modules */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFunction } from 'i18next'
import { ReactNode } from 'react'
import { OrderDirection } from './order'

export type RenderTableField<T> = (
  data: T,
  args?: { t: TFunction; index: number }
) => ReactNode

export interface TableSpec<T = any> {
  key: string
  /** the key to be used for sorting. if specified, the sort button will be shown in the table */
  sortKey?: string
  /** the default sort direction to apply when clicking sort button (defaults to DESC) */
  defaultSortDirection?: OrderDirection
  header?: string
  headerClassName?: string
  contentClassName?: string
  hiddenOnMobile?: boolean
  showHeaderInCellOnMobile?: boolean
  renderHeader?: () => ReactNode
  renderValue?: RenderTableField<T>
  getRawValue?: RenderTableField<T> | null
}

export type ColumnSettingsValue =
  | Record<string, boolean | undefined>
  | undefined
