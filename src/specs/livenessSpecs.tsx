import classNames from 'classnames'
import VerifyBadge from 'components/base/VerifyBadge'
import { TableSpec } from 'types/generic/table'

const renderValueWithClassNames = (
  value: string | undefined,
  isValid?: boolean
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
) => <div className={classNames(isValid && 'text-error')}>{value || '-'}</div>

export const livenessSpace: TableSpec[] = [
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
    contentClassName: 'text-center',
    headerClassName: 'text-center',
    renderValue: ({ verificationResult }) =>
      renderValueWithClassNames(verificationResult),
  },
  {
    key: 'liveness',
    header: 'caseDetail.verification.headers.liveness',
    headerClassName: 'text-center',
    renderValue: ({ liveness }) => (
      <VerifyBadge
        className=" justify-center"
        verified={liveness.value}
        label={liveness.label}
      />
    ),
  },
  {
    key: 'faceComparison',
    header: 'caseDetail.verification.headers.faceComparison',
    headerClassName: 'text-center',
    renderValue: ({ faceComparison }) => (
      <VerifyBadge
        className=" justify-center"
        verified={faceComparison?.value}
        label={faceComparison?.label}
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
