import classNames from 'classnames'
import { TableSpec } from 'types/generic/table'
import VerifyBadge from 'components/base/VerifyBadge'

const renderValueWithClassNames = (
  value: string | undefined,
  isValid?: boolean
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
) => <div className={classNames(isValid && 'text-error')}>{value || '-'}</div>

export const dopaSpace: TableSpec[] = [
  {
    key: 'verificationDate',
    header: 'caseDetail.verification.headers.verificationDate',
    headerClassName: 'rounded-l-lg text-center',
    contentClassName: 'text-center',
    renderValue: ({ verificationDate }) =>
      renderValueWithClassNames(verificationDate),
  },
  {
    key: 'verificationTime',
    header: 'caseDetail.verification.headers.verificationTime',
    contentClassName: 'text-center',
    headerClassName: 'text-center',
    renderValue: ({ verificationTime }) =>
      renderValueWithClassNames(verificationTime),
  },
  {
    key: 'verificationResult',
    header: 'caseDetail.verification.headers.verificationResult',
    headerClassName: 'text-center',
    renderValue: ({ isValid, verificationResult }) => (
      <VerifyBadge
        className="justify-center"
        verified={!isValid}
        label={verificationResult}
      />
    ),
  },
  {
    key: 'remark',
    header: 'caseDetail.verification.headers.remark',
    headerClassName: 'rounded-r-lg text-center',
    contentClassName: 'text-center',
    renderValue: ({ remark }) => renderValueWithClassNames(remark),
  },
]
