import { TabItemConfig } from 'types/generic/tabs'
import { VerificationProcess } from 'types/kycCore'

export const verificationConfig: TabItemConfig[] = [
  {
    key: 'overview',
    label: 'processes.overview',
  },
  {
    key: VerificationProcess.PASSPORT,
    label: 'processes.passport',
  },
  {
    key: VerificationProcess.FRONT_ID_CARD,
    label: 'processes.frontIdCard',
  },
  {
    key: VerificationProcess.BACK_ID_CARD,
    label: 'processes.backIdCard',
  },
  {
    key: VerificationProcess.DOPA,
    label: 'processes.idCardVerification',
  },
  {
    key: VerificationProcess.LIVENESS,
    label: 'processes.liveness',
  },
]
