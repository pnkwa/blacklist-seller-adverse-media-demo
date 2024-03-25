import { VerificationProcess } from './verification'

export interface ProcessConfig {
  key: VerificationProcess
  dependencies: VerificationProcess[]
  eitherDependencies: VerificationProcess[]
}
