import { useTranslation } from 'react-i18next'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { getMasterdataTranslation } from 'utils/translations'
import { Dropdown } from 'components/base/Dropdown'
import { generateTemporalArray } from 'utils/date'
import { masterdataToOption, temporalToMasterdata } from 'utils/masterdata'
import { Masterdata } from 'types/generic'
import {
  CriteriaTopic,
  OverriddenFormControl,
  ProcessCriteriaFormProps,
} from './common'

const minJudgementDayMasterdata: Masterdata[] = [
  {
    key: null as unknown as string,
    translations: { th: 'ไม่ระบุเวลา', en: 'Unspecified Time' },
  },
  ...generateTemporalArray(10).map(temporalToMasterdata),
]

export const CriminalRecordCriteriaForm: React.FC<ProcessCriteriaFormProps> = ({
  criteria,
  onChange,
}) => {
  const { t } = useTranslation()
  const { masterdatas } = useTenantConfigContext()

  const { criminalRecordTypes } = masterdatas ?? {}
  const { minJudgementDay } = criteria ?? {}

  const minJudgementDayOptions =
    minJudgementDayMasterdata.map(masterdataToOption)

  return (
    <div className="sm:space-y-2">
      <div className="mb-4 whitespace-pre-wrap">
        {t('settingsPage.criteria.criminalRecord.formTitle')}
      </div>
      {criminalRecordTypes?.map((type) => {
        const id = `${type.key}-checkbox`
        const { key } = type
        if (!key) return null
        const criteriaValue = minJudgementDay?.[key]
        const checked = criteriaValue !== 'any'
        return (
          <CriteriaTopic
            id={id}
            key={id}
            checked={checked}
            onCheck={(checked) => {
              onChange?.({
                ...criteria,
                minJudgementDay: {
                  ...minJudgementDay,
                  [key]: checked ? null : 'any',
                },
              })
            }}
            label={getMasterdataTranslation(type) ?? ''}
          >
            <OverriddenFormControl label={t('generic.lessThan')}>
              <Dropdown
                className="w-full min-w-[180px]"
                value={minJudgementDayOptions.find(
                  ({ value }) => (criteriaValue ?? null) === value
                )}
                options={minJudgementDayOptions}
                onChange={(option) =>
                  onChange?.({
                    ...criteria,
                    minJudgementDay: {
                      ...minJudgementDay,
                      [key]: option.value,
                    },
                  })
                }
              />
            </OverriddenFormControl>
          </CriteriaTopic>
        )
      })}
    </div>
  )
}
