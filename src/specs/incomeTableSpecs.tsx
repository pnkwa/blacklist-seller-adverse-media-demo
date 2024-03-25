import classNames from 'classnames'
import moment from 'moment'
import i18n from 'i18next'
import { BackgroundCheck } from 'types/bgcCore'
import { TableSpec } from 'types/generic/table'
import { formatCurrency } from 'utils/currency'

interface IncomeInformation {
  month: string | null
  initial?: string | null
  psBase?: string | null
  psNet?: string | null
  bsNet?: string | null
  isValid?: boolean | null
}

const renderValueWithClassNames = (
  value: string | undefined,
  isValid: boolean
) => (
  <div
    className={classNames(
      'capitalize whitespace-pre-wrap',
      isValid && 'text-error'
    )}
  >
    {i18n.t(value ?? '-')}
  </div>
)

const renderIncomeValue = (value: IncomeInformation, key: string) =>
  renderValueWithClassNames(value[key], !!value?.isValid)

export const getIncomeInformation = (
  bgc: BackgroundCheck | undefined
): IncomeInformation[] | undefined =>
  bgc?.income?.results?.map(({ bankStatement, payslip, verified }) => ({
    month: moment(bankStatement?.transactionDate)
      .format('MMMM')
      .toLowerCase(),
    initial: formatCurrency(bgc?.verificationInfo?.baseSalary),
    psBase: formatCurrency(payslip?.baseSalary),
    psNet: formatCurrency(payslip?.netSalary),
    bsNet: formatCurrency(bankStatement?.amount),
    isValid: !verified,
  }))

export const incomeTableSpec: TableSpec[] = [
  {
    key: 'month',
    header: 'caseDetail.income.headers.month',
    headerClassName: 'rounded-l-lg text-center',
    renderValue: (value: IncomeInformation) =>
      renderIncomeValue(value, 'month'),
  },
  {
    key: 'initial',
    header: 'caseDetail.income.headers.initial',
    headerClassName: 'text-center',
    renderValue: (value: IncomeInformation) =>
      renderIncomeValue(value, 'initial'),
  },
  {
    key: 'psBase',
    header: 'caseDetail.income.headers.psBase',
    headerClassName: 'text-center',
    renderValue: (value: IncomeInformation) =>
      renderIncomeValue(value, 'psBase'),
  },
  {
    key: 'psNet',
    header: 'caseDetail.income.headers.psNet',
    headerClassName: 'text-center',
    renderValue: (value: IncomeInformation) =>
      renderIncomeValue(value, 'psNet'),
  },
  {
    key: 'bsNet',
    header: 'caseDetail.income.headers.bsNet',
    headerClassName: 'rounded-r-lg text-center',
    renderValue: (value: IncomeInformation) =>
      renderIncomeValue(value, 'bsNet'),
  },
]
