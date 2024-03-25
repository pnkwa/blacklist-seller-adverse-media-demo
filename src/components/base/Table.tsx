/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable import/no-unused-modules */
import {
  faArrowDown,
  faArrowUp,
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TableSpec } from 'types/generic/table'
import { getIndexedId } from 'utils/element'
import { Order } from 'types/generic'
import { Checkbox } from 'components/form/Checkbox'
import { Spinner } from './Spinner'
import { ErrorPlaceholder, NoCasesPlaceholder } from './DetailPlaceholder'

interface BaseDataType {
  id?: string | null
}

type OnSelectRowFunc<T> = (record: T, index: number) => unknown

interface TableProps<T extends BaseDataType> {
  data: T[] | null | undefined
  tableSpecs: TableSpec<T>[]
  tableClassName?: string
  theadClassName?: string
  rowClassName?: string
  tdClassName?: string
  loading?: boolean
  error?: boolean
  placeholder?: React.ReactNode
  sortOrder?: Order
  checkedIndexes?: number[]
  hasCheckbox?: boolean
  onSort?: (order: Order) => unknown
  onSelectRow?: OnSelectRowFunc<T>
  onCheckItem?: (item: T, index: number, checked: boolean) => void
  renderExpandedRow?: (record: T, index: number) => ReactNode
}

interface TableRowProps<T extends BaseDataType> {
  className?: string
  tdClassName?: string
  record: T
  tableId: string
  index: number
  tableSpecs: TableSpec<T>[]
  checkedIndexes?: number[]
  hasCheckbox?: boolean
  checkItem?: (item: T, index: number, checked: boolean) => void
  onSelectRow?: OnSelectRowFunc<T>
  renderExpandedRow?: (record: T, index: number) => ReactNode
}

export function TableRow<T extends BaseDataType>({
  record,
  tableId,
  index,
  tableSpecs,
  className,
  tdClassName,
  checkedIndexes,
  hasCheckbox = false,
  checkItem,
  onSelectRow,
  renderExpandedRow,
}: TableRowProps<T>) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const renderTableCol = useCallback(
    (record: T, rowIndex: number) =>
      ({
        key,
        contentClassName,
        renderValue,
        header,
        hiddenOnMobile,
        showHeaderInCellOnMobile,
      }: TableSpec<T>) => {
        return (
          <td
            key={key}
            className={classNames(
              'p-4',
              showHeaderInCellOnMobile,
              hiddenOnMobile && 'hidden sm:table-cell',
              tdClassName,
              contentClassName
            )}
          >
            {showHeaderInCellOnMobile && header ? (
              <div className="sm:hidden opacity-50 mr-2">{t(header)}:</div>
            ) : null}
            {renderValue?.(record, { t, index: rowIndex })}
          </td>
        )
      },
    [t, tdClassName]
  )

  return (
    <>
      <tr
        key={record.id ?? `${tableId}-record-${index}`}
        className={classNames(
          onSelectRow && 'hover:bg-base-200 hover:bg-opacity-30 cursor-pointer',
          className
        )}
        onClick={() => onSelectRow?.(record, index)}
      >
        {renderExpandedRow ? (
          <td
            role="gridcell"
            aria-label="expand"
            className="p-4 text-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded((prev) => !prev)
            }}
          >
            <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} />
          </td>
        ) : null}
        {checkItem && hasCheckbox && (
          <td aria-label="checkbox" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              className="bg-base-100 checked:checkbox-primary"
              checked={checkedIndexes?.includes(index)}
              onChange={(e) => checkItem(record, index, e.target.checked)}
            />
          </td>
        )}
        {tableSpecs.map(renderTableCol(record, index))}
      </tr>
      {expanded && renderExpandedRow?.(record, index)}
    </>
  )
}

const PlaceholderRow = ({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode
  className?: string
  colSpan: number
}) => (
  <tr className={classNames('border-b-0', className)}>
    <td colSpan={colSpan} className="w-full text-center">
      {children}
    </td>
  </tr>
)

export function Table<T extends BaseDataType>({
  data,
  loading,
  error,
  tableSpecs,
  tableClassName,
  theadClassName,
  rowClassName,
  tdClassName,
  placeholder,
  sortOrder,
  checkedIndexes,
  hasCheckbox = false,
  onSort,
  onSelectRow,
  onCheckItem,
  renderExpandedRow,
}: TableProps<T>) {
  const tableId = useMemo(() => getIndexedId('table'), [])
  const { t } = useTranslation()

  const specs: TableSpec<T>[] = useMemo(() => {
    const expandButtonCol: TableSpec<T> = {
      key: 'expand',
      headerClassName: 'w-[56px]',
    }
    return [
      ...(renderExpandedRow ? [expandButtonCol] : []), // expand button col
      ...tableSpecs,
    ]
  }, [renderExpandedRow, tableSpecs])

  const checkAllItems = useCallback(
    (checked) => {
      if (!data) return

      data?.forEach((record, index) => {
        onCheckItem?.(record, index, checked)
      })
    },
    [data, onCheckItem]
  )

  const checkItem = useCallback(
    (record, index, checked) => {
      onCheckItem?.(record, index, checked)
    },
    [onCheckItem]
  )

  useEffect(() => () => checkAllItems(false), [checkAllItems])

  const renderHeader = useCallback(
    (ts: TableSpec<T>) => {
      const { defaultSortDirection = 'DESC', hiddenOnMobile } = ts
      const [mainSortKey, ...otherSortKeys] = ts.sortKey?.split(',') ?? []
      const prevSortValue = mainSortKey && sortOrder?.[mainSortKey]
      const isSortActive = Object.keys(sortOrder ?? {})[0] === mainSortKey
      const iconSortDisplay = prevSortValue ?? defaultSortDirection
      return (
        <th
          key={ts.key}
          className={classNames(
            'text-left font-normal p-4 bg-base-200/50 relative',
            "after:content-[''] after:absolute after:w-[1px] after:inset-y-3 after:bg-base-300 after:right-0 last:after:hidden",
            hiddenOnMobile && 'hidden sm:table-cell',
            ts.headerClassName
          )}
        >
          {ts.header ? t(ts.header) : ts.renderHeader?.() || ''}
          {mainSortKey && (
            <FontAwesomeIcon
              icon={iconSortDisplay === 'DESC' ? faArrowDown : faArrowUp}
              onClick={() => {
                if (!mainSortKey) return
                let direction = defaultSortDirection
                if (isSortActive)
                  direction = prevSortValue === 'DESC' ? 'ASC' : 'DESC'
                const order: Order = { [mainSortKey]: direction }
                otherSortKeys.forEach((key) => {
                  order[key] = direction
                })
                onSort?.(order)
              }}
              className={classNames(
                'text-2xs ml-1',
                onSort && 'cursor-pointer',
                isSortActive ? 'opacity-100' : 'opacity-30'
              )}
            />
          )}
        </th>
      )
    },
    [onSort, sortOrder, t]
  )

  return (
    <table
      id={tableId}
      className={classNames('table text-sm text-base-content', tableClassName)}
    >
      <thead className={classNames(theadClassName)}>
        <tr
          className={classNames(
            'z-[2] border-none',
            "after:content-[''] after:absolute after:h-[1px] after:inset-x-0 after:bg-base-200 after:bottom-0"
          )}
        >
          {hasCheckbox && (
            <td aria-label="checkbox" className="bg-base-200/50">
              <Checkbox
                className="bg-base-100 checked:checkbox-primary"
                checked={
                  !!data?.length && checkedIndexes?.length === data?.length
                }
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => checkAllItems(e.target.checked)}
              />
            </td>
          )}
          {specs.map(renderHeader)}
        </tr>
      </thead>

      <tbody>
        {loading && (
          <PlaceholderRow colSpan={specs.length}>
            <Spinner className="w-8 text-primary my-12" />
          </PlaceholderRow>
        )}
        {error && (
          <PlaceholderRow colSpan={specs.length}>
            <ErrorPlaceholder className="h-64" />
          </PlaceholderRow>
        )}
        {!loading &&
          !error &&
          (data?.length ? (
            data?.map((record: T, index: number) => (
              <TableRow
                key={record.id}
                record={record}
                index={index}
                onSelectRow={onSelectRow}
                renderExpandedRow={renderExpandedRow}
                tableSpecs={tableSpecs}
                tableId={tableId}
                className={rowClassName}
                tdClassName={tdClassName}
                checkedIndexes={checkedIndexes}
                checkItem={checkItem}
                hasCheckbox={hasCheckbox}
              />
            ))
          ) : (
            <PlaceholderRow colSpan={specs.length}>
              {placeholder ?? <NoCasesPlaceholder className="!h-64" />}
            </PlaceholderRow>
          ))}
      </tbody>
    </table>
  )
}
