export type PermissionTable =
  | 'application_transaction_rule'
  | 'background_check'
  | 'case'
  | 'client'
  | 'currency'
  | 'document'
  | 'event'
  | 'exchange'
  | 'group'
  | 'pdf'
  | 'policy'
  | 'proprietor_verification'
  | 'proprietor'
  | 'role'
  | 'sandbox'
  | 'spreadsheet'
  | 'status_metric'
  | 'transaction'
  | 'user'
  | 'verification'
  | 'wallet'
  | 'flow'

export type PermissionAction =
  | 'create'
  | 'read'
  | 'export'
  | 'update'
  | 'delete'
  | 'switch'

export interface Permission {
  table?: PermissionTable
  action?: PermissionAction
  permissions?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  fields?: string[]
}

export interface Role {
  id: string
  priority: number
  description?: string
  name?: string
  suggestedGroups?: string[]
  permissions?: Permission[]
}

/**
 * Cached user entity that owns objects within the Case Keeper API.
 * This interface is used for displaying the user data in the menu,
 * or when we need to display owners in case details.
 */
export interface User {
  id?: string
  username?: string
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  groups?: string[]
  createdAt?: Date
  updatedAt?: Date
  role?: Role
}
