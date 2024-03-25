import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { BackgroundCheck, BackgroundCheckProcessName } from 'types/bgcCore'
import { Table } from 'components/base/Table'
import {
  getSanctionUnions,
  getSanctionsData,
  getIdentificationData,
} from 'utils/bgcCore/sanction'
import { Tabs } from 'components/base/Tabs'
import UnSvg from 'assets/svg/united-nation.svg?react'
import { displayFields, sanctionTableSpec } from 'specs/sanctionTableSpecs'
import { Flow } from 'types/caseKeeperCore'
import BaseBackgroundCheckDetail from '../BaseBackgroundCheckDetail'

interface SanctionSectionProps {
  flow?: Flow
}

const SanctionSection: FC<SanctionSectionProps> = ({ flow }) => {
  const { t } = useTranslation()

  const { backgroundCheck } = flow ?? {}
  const { persons } = backgroundCheck?.sanction ?? {}

  const [sanctionType, setSanctionType] = useState<string>('')

  const unions = useMemo(() => {
    if (!persons) return []
    const resultUnions = getSanctionUnions(persons)
    const unions = resultUnions.map((union) => ({
      key: union,
      label: t(`caseDetail.sanction.unions.${union.toLowerCase()}`),
    }))
    setSanctionType(unions[0]?.key)

    return unions
  }, [persons, t, setSanctionType])

  const sanctionData = useMemo(() => {
    if (!persons) return []
    const sanctionList = persons.filter(
      (list) => sanctionType === list?.sanctionBy
    )
    const sanctionData = getSanctionsData(displayFields, sanctionList)

    return Object.keys(sanctionData).map((k) => ({
      column: k,
      value: Array.isArray(sanctionData?.[k])
        ? getIdentificationData(k, sanctionData)
        : sanctionData?.[k] ?? '-',
    }))
  }, [persons, sanctionType])

  const hasPersons = useMemo(() => !!persons?.length, [persons?.length])

  return (
    <BaseBackgroundCheckDetail
      backgroundCheck={backgroundCheck as BackgroundCheck}
      process={BackgroundCheckProcessName.SANCTION}
    >
      <div className="pt-4 flex gap-2 items-center font-bold">
        <UnSvg /> {t('caseDetail.sanction.result.title')}
      </div>
      <div
        className={classNames(
          'bg-base-200 rounded-md my-4 p-4 pl-8',
          hasPersons ? 'text-error' : 'text-neutral-500'
        )}
      >
        {t(`caseDetail.sanction.result.${hasPersons ? 'found' : 'notFound'}`)}
      </div>
      {hasPersons && (
        <div className="pt-4 px-6 flex-1">
          <div className="w-full overflow-x-auto">
            <Tabs
              className="max-w-fit overflow-x-auto pb-2 border-none"
              tabClass="!p-0 mr-4"
              tabsConfig={unions}
              activeTab={sanctionType}
              onChangeTab={(tab) => setSanctionType(tab)}
            />
          </div>
          <div className="w-full overflow-x-auto">
            <Table
              key={sanctionType}
              data={sanctionData}
              tableSpecs={sanctionTableSpec}
              theadClassName="hidden"
              tdClassName="px-1 pt-1 pb-2 sm:pb-4 sm:pt-4 sm:px-4"
            />
          </div>
        </div>
      )}
    </BaseBackgroundCheckDetail>
  )
}

export default SanctionSection
