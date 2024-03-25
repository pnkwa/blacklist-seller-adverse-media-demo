import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BackgroundCheck,
  BackgroundCheckProcessName,
  EmploymentReferenceResult,
  ReferencePerson,
} from 'types/bgcCore'
import { joinStrings } from 'utils/string'
import { Field } from 'components/base/Field'
import { Flow } from 'types/caseKeeperCore'
import VerifyBadge from 'components/base/VerifyBadge'
import BaseBackgroundCheckDetail from '../BaseBackgroundCheckDetail'

interface EmploymentReferenceSectionProps {
  flow?: Flow
}

const EmploymentReferenceSection: FC<EmploymentReferenceSectionProps> = ({
  flow,
}) => {
  const { backgroundCheck } = flow ?? {}
  const { t, i18n } = useTranslation()
  const { employmentReference, verificationInfo } = backgroundCheck ?? {}
  const { references, remark, result } = employmentReference ?? {}

  const fields: {
    key: string
    getValue: (r: ReferencePerson) => React.ReactNode
  }[] = useMemo(
    () => [
      {
        key: 'name',
        getValue: (r) => joinStrings([r.firstName, r.lastName], ' '),
      },
      {
        key: 'position',
        getValue: (r) => r.position,
      },
      {
        key: 'companyName',
        getValue: (r) => r.companyName,
      },
      {
        key: 'phoneNumber',
        getValue: (r) => r.phoneNumber,
      },
      {
        key: 'companyPosition',
        getValue: (r) => r.companyPosition,
      },
      {
        key: 'registeredPosition',
        getValue: () =>
          verificationInfo?.position?.translations?.[i18n.language]?.label,
      },
    ],
    [i18n.language, verificationInfo?.position?.translations]
  )

  const referenceList = useMemo(() => {
    return (
      <div className="flex flex-row space-x-8">
        <div className="flex flex-col space-y-4">
          {fields.map((d) => (
            <p key={d.key} className="text-sm font-bold">
              {t(`caseDetail.employmentReference.fields.${d.key}`)}
            </p>
          ))}
        </div>
        {references?.map((r) => (
          <div className="flex flex-col space-y-4" key={r.id}>
            {fields.map((d) => (
              <p key={d.key} className="text-sm">
                {d.getValue(r) ?? '-'}
              </p>
            ))}
          </div>
        ))}
      </div>
    )
  }, [fields, references, t])

  return (
    <BaseBackgroundCheckDetail
      backgroundCheck={backgroundCheck as BackgroundCheck}
      process={BackgroundCheckProcessName.EMPLOYMENT_REFERENCE}
    >
      <div className="space-y-4 w-full">
        <Field
          className="cursor-default"
          title={t('caseDetail.employmentReference.fields.result')}
        >
          <VerifyBadge
            verified={result === EmploymentReferenceResult.PASSED}
            label={t(`caseDetail.employmentReference.result.${result}`)}
          />
        </Field>
        <Field
          className="cursor-default"
          title={t('caseDetail.employmentReference.fields.details')}
        >
          <div className="whitespace-pre-wrap">{remark ?? '-'}</div>
        </Field>
        <div className="font-bold my-4">
          {t('caseDetail.employmentReference.fields.referenceList')}:
        </div>
        {referenceList}
      </div>
    </BaseBackgroundCheckDetail>
  )
}

export default EmploymentReferenceSection
