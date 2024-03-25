import classNames from 'classnames'
import { TableSpec } from 'types/generic/table'

export interface CRSSHTableSpecs {
  order: string
  type: string
  result: string
  remark: string
  isValid: boolean
}

export const crSSHTableSpecs: TableSpec[] = [
  {
    key: 'order',
    header: 'caseDetail.crSSH.headers.order',
    headerClassName: 'rounded-l-lg text-center',
    renderValue: ({ order }: CRSSHTableSpecs) => <div>{order}</div>,
  },
  {
    key: 'type',
    headerClassName: 'text-center',
    header: 'caseDetail.crSSH.headers.type',
    renderValue: ({ type }: CRSSHTableSpecs) => (
      <div className="font-bold">{type}</div>
    ),
  },
  {
    key: 'result',
    headerClassName: 'text-center',
    contentClassName: 'flex justify-center',
    header: 'caseDetail.crSSH.headers.result',
    renderValue: ({ result, isValid }: CRSSHTableSpecs) => (
      <div
        className={classNames(
          'w-fit bg-opacity-20 p-1 rounded-lg',
          isValid ? 'bg-error text-error' : 'bg-success text-success'
        )}
      >
        {result}
      </div>
    ),
  },
  {
    key: 'remark',
    header: 'caseDetail.crSSH.headers.remark',
    headerClassName: 'rounded-r-lg text-center',
    renderValue: ({ remark }: CRSSHTableSpecs) => <div>{remark}</div>,
  },
]
