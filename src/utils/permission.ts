import {
  Permission,
  PermissionAction,
  PermissionTable,
} from 'types/caseKeeperCore'

const findPermission = (
  permissions?: Permission[],
  table?: PermissionTable,
  action?: PermissionAction
) => permissions?.find((x) => x.table === table && x.action === action)

export const checkPermissions = (
  requiredPermissions: Permission[],
  userPermissions?: Permission[]
) =>
  requiredPermissions.every((curr) =>
    findPermission(userPermissions, curr.table, curr.action)
  )

export const checkPermissionsField = (
  requiredPermissions: Permission[],
  fieldName: string,
  userPermissions?: Permission[]
) =>
  requiredPermissions.every(
    (curr) =>
      findPermission(
        userPermissions,
        curr.table,
        curr.action
      )?.fields?.includes(fieldName)
  )
