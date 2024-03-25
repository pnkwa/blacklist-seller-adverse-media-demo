import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import classNames from 'classnames'
import { getMiddleIndex } from 'utils/common'
import { TableSpec } from 'types/generic/table'
import { useWindowDimensions } from 'hooks/useWindowDimensions'
import { breakpoints } from 'config/breakpoints'
import { Table } from './Table'

interface BaseDataType {
  id?: string | null
}

interface SplitTableProps<T extends BaseDataType> {
  title: string
  data: T[]
  tableSpecs: TableSpec<T>[]
  theadClassName?: string
  tdClassName?: string
}

export function SplitTable<T extends BaseDataType>({
  data,
  title,
  ...rest
}: SplitTableProps<T>) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const shouldSplit = useMemo(() => width >= breakpoints.lg, [width])

  const splittedData = useMemo(() => {
    const middleIndex = getMiddleIndex(data)
    const arr1 = shouldSplit ? data.slice(0, middleIndex) : data
    const arr2 = shouldSplit ? data.slice(middleIndex) : []
    return [arr1, arr2]
  }, [data, shouldSplit])

  return (
    <>
      {title && <h1 className="font-bold mb-2 text-start"> {t(title)}</h1>}
      <div className="grid grid-flow-col lg:gap-12">
        <div className={classNames(!shouldSplit && '!w-full')}>
          <Table key={`${title}-1`} data={splittedData[0]} {...rest} />
        </div>
        {shouldSplit && (
          <Table key={`${title}-2`} data={splittedData[1]} {...rest} />
        )}
      </div>
    </>
  )
}
