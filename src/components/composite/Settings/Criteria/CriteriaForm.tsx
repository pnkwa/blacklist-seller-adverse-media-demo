import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { Radio } from 'components/form/Radio'
import { processCriteriaFormSpecs } from 'specs/processCriteriaFormSpecs'
import {
  BackgroundCheckProcessName,
  CriteriaMapping,
  ProcessCriteria,
} from 'types/bgcCore'

interface ProcessBoxProps {
  processName: BackgroundCheckProcessName
  children?: React.ReactNode
  criteria: ProcessCriteria | undefined
  initialCriteria: ProcessCriteria | undefined
  onChange: (value: ProcessCriteria | undefined) => unknown
}

const ProcessBox: React.FC<ProcessBoxProps> = ({
  processName,
  children,
  criteria,
  initialCriteria,
  onChange,
}) => {
  const { t } = useTranslation()

  const isCustom = !!criteria

  return (
    <div className="border rounded-box py-4 px-4 sm:px-6">
      <div className="block space-y-2 sm:space-y-0 sm:flex">
        <div className="flex-1 font-bold">{t(`processes.${processName}`)}</div>
        <Radio
          fieldKey={`${processName}.mode`}
          className="radio-sm"
          optionClassName="first:min-w-[140px]"
          options={['default', 'custom']}
          value={isCustom ? 'custom' : 'default'}
          onChange={(e) => {
            const { value } = e.target
            // if click custom, reset to initial criteria (the latest one that was saved in tenant)
            onChange(value === 'custom' ? initialCriteria ?? {} : undefined)
          }}
          translatePrefix={`settingsPage.criteria.${processName}`}
        />
      </div>
      {isCustom && <div className="mt-4 pt-6 pb-2 border-t">{children}</div>}
    </div>
  )
}

interface CriteriaFormProps {
  criteriaMapping: CriteriaMapping
  initialCriteriaMapping: CriteriaMapping
  onChange: (value: CriteriaMapping) => unknown
  className?: string
}

export const CriteriaForm: React.FC<CriteriaFormProps> = ({
  criteriaMapping,
  initialCriteriaMapping,
  onChange,
  className,
}) => {
  const criteriaMappingKeys = useMemo(
    () => Object.keys(criteriaMapping),
    [criteriaMapping]
  )

  return (
    <div className={classNames('space-y-4 text-sm', className)}>
      {processCriteriaFormSpecs.map(({ key, form: Form }) => {
        if (!criteriaMappingKeys.includes(key)) return null
        return (
          <ProcessBox
            key={key}
            processName={key as BackgroundCheckProcessName}
            criteria={criteriaMapping[key]}
            initialCriteria={initialCriteriaMapping[key]}
            onChange={(v) => onChange({ ...criteriaMapping, [key]: v })}
          >
            <Form
              onChange={(v) => onChange({ ...criteriaMapping, [key]: v })}
              criteria={criteriaMapping[key]}
            />
          </ProcessBox>
        )
      })}
    </div>
  )
}
