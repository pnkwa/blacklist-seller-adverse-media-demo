import { Flow } from './flow'
import { User } from './user'

export interface Event<T = Flow> {
  id?: string
  key?: string
  dataId?: string
  data?: T
  userId?: string
  user?: User
  createdAt?: Date
  deletedAt?: Date
  updatedAt?: Date
}
