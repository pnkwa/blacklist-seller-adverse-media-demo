import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { useSelector } from 'react-redux'
import { BackgroundCheckProcessName } from 'types/bgcCore'
import { filterProcesses } from 'utils/caseKeeperCore/processesConfig'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { Flow } from 'types/caseKeeperCore'
import { getReload } from 'reducers'
import KycSection from './KycSection'
import EmploymentReferenceSection from './EmploymentReferenceSection'
import EducationSection from './EducationSection'
import CRSSHSection from './CRSSHSection'
import IncomeSection from './IncomeSection'
import SanctionSection from './SanctionSection'
import BankruptcySection from './BankruptcySection'
import AdverseMediaSection from './AdverseMediaSection'

const section = {
  kyc: KycSection,
  [BackgroundCheckProcessName.CRIMINAL_RECORD]: CRSSHSection,
  [BackgroundCheckProcessName.SOCIAL_SECURITY_HISTORY]: CRSSHSection,
  [BackgroundCheckProcessName.ADVERSE_MEDIA]: AdverseMediaSection,
  [BackgroundCheckProcessName.BANKRUPTCY]: BankruptcySection,
  [BackgroundCheckProcessName.SANCTION]: SanctionSection,
  [BackgroundCheckProcessName.EDUCATION]: EducationSection,
  [BackgroundCheckProcessName.INCOME]: IncomeSection,
  [BackgroundCheckProcessName.EMPLOYMENT_REFERENCE]: EmploymentReferenceSection,
}

interface SectionIndexProps {
  flow: Flow
  setFlow: Dispatch<SetStateAction<Flow>>
}

const SectionIndex: FC<SectionIndexProps> = ({ flow, setFlow }) => {
  const reload = useSelector(getReload)

  const { fetchBackgroundCheckById, fetchVerificationById } =
    useCaseKeeperContext()

  const filteredProcesses = useMemo(() => {
    if (!flow?.backgroundCheck?.processConfigs) return []
    return filterProcesses(flow.backgroundCheck.processConfigs, ['kyc'])
  }, [flow])

  const fetchData = useCallback(async () => {
    if (!flow?.backgroundCheckId || !flow?.verificationId) return
    const verification = await fetchVerificationById(flow.verificationId)
    const backgroundCheck = await fetchBackgroundCheckById(
      flow.backgroundCheckId
    )
    setFlow((prev) => ({ ...prev, backgroundCheck, verification }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchBackgroundCheckById,
    fetchVerificationById,
    flow.backgroundCheckId,
    flow.verificationId,
    setFlow,
    reload,
  ])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="w-full lg:pt-0 lg:ml-4 space-y-4 my-4 lg:my-0 overflow-x-auto">
      {filteredProcesses.map((process) => {
        const Component = section?.[process.key]
        return Component ? (
          <Component
            key={process.key}
            process={process.key}
            flow={flow}
            setFlow={setFlow}
          />
        ) : null
      })}
    </div>
  )
}

export default SectionIndex
