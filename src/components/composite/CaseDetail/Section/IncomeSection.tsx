import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BackgroundCheck,
  BackgroundCheckProcessName,
  BackgroundCheckStatus,
} from 'types/bgcCore'
import { incomeTableSpec, getIncomeInformation } from 'specs/incomeTableSpecs'
import { Table } from 'components/base/Table'
import { Flow } from 'types/caseKeeperCore'
import VerifyBadge from 'components/base/VerifyBadge'
import BaseBackgroundCheckDetail from '../BaseBackgroundCheckDetail'

interface IncomeSectionProps {
  flow?: Flow
}

const IncomeSection: FC<IncomeSectionProps> = ({ flow }) => {
  const { t } = useTranslation()
  const { backgroundCheck } = flow ?? {}
  const { income, incomeStatus } = backgroundCheck ?? {}

  const isRejected = useMemo(
    () => incomeStatus === BackgroundCheckStatus.REJECTED,
    [incomeStatus]
  )

  const validatedStatus = useMemo(() => {
    if (isRejected) return 'unableToVerify'
    if (income?.verified) return 'passed'
    return 'notPassed'
  }, [income?.verified, isRejected])

  return (
    <BaseBackgroundCheckDetail
      backgroundCheck={backgroundCheck as BackgroundCheck}
      process={BackgroundCheckProcessName.INCOME}
    >
      <div className="flex flex-col space-y-2 pb-3">
        <div className="flex">
          <b className="min-w-[150px]">{t('caseDetail.income.result')}:</b>
          <VerifyBadge
            className="w-full"
            verified={validatedStatus === 'passed'}
            label={t(`status.income.${validatedStatus}`)}
          />
        </div>
        <div className="flex">
          <b className="min-w-[150px]">{t('caseDetail.income.remark')}:</b>
          <p className="w-full whitespace-pre-wrap">
            {backgroundCheck?.income?.remark ?? '-'}
          </p>
        </div>
      </div>
      <div className="w-fll overflow-x-auto">
        <Table
          key="incomeTable"
          tableClassName="sm:min-w-max"
          theadClassName="rounded-lg"
          tdClassName="px-0 pt-0 py-2 text-center sm:pb-4 sm:pt-4 sm:px-4"
          data={getIncomeInformation(backgroundCheck) ?? []}
          tableSpecs={incomeTableSpec}
        />
      </div>
    </BaseBackgroundCheckDetail>
  )
}

export default IncomeSection
