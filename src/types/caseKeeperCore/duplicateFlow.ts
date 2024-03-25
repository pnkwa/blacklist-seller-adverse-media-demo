import { Flow } from './flow'
import { FlowInput } from './flowInput'

export interface DuplicateFlow {
  duplicates: Flow[]
  initialFlow: FlowInput
}
