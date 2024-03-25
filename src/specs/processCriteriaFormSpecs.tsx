import { CriminalRecordCriteriaForm } from 'components/composite/Settings/Criteria/ProcessCriteriaForms/CriminalRecordCriteriaForm'
import { ProcessCriteriaFormProps } from 'components/composite/Settings/Criteria/ProcessCriteriaForms/common'
import { SocialSecurityHistoryCriteriaForm } from 'components/composite/Settings/Criteria/ProcessCriteriaForms/SocialSecurityHistoryCriteriaForm'
import { BackgroundCheckProcessName } from 'types/bgcCore'

export const processCriteriaFormSpecs: {
  key: BackgroundCheckProcessName
  form: React.FC<ProcessCriteriaFormProps>
}[] = [
  {
    key: BackgroundCheckProcessName.CRIMINAL_RECORD,
    form: CriminalRecordCriteriaForm,
  },
  {
    key: BackgroundCheckProcessName.SOCIAL_SECURITY_HISTORY,
    form: SocialSecurityHistoryCriteriaForm,
  },
]
