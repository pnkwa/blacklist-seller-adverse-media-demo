import { Flow } from 'types/caseKeeperCore'
import { getVerificationInfoFullName } from 'utils/verificationInfo'
import { FlowAvatarImage } from '../FlowAvatarImage'

interface CandidateNameAndPhotoProps {
  flow: Flow
}

export const CandidateNameAndPhoto = ({ flow }: CandidateNameAndPhotoProps) => (
  <div className="flex items-center">
    <FlowAvatarImage flow={flow} />
    <span className="ml-2">
      {flow.backgroundCheck?.verificationInfo &&
        getVerificationInfoFullName(
          flow.backgroundCheck?.verificationInfo,
          false
        )}
    </span>
  </div>
)
