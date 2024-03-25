import {
  createCasePrms,
  createCaseProprietorPolicyPrms,
  createProprietorPrms,
  readCasePrms,
  readProprietorPrms,
} from 'config/permission'
import { Permission } from 'types/caseKeeperCore'
import { checkPermissionsField, checkPermissions } from './permission'

describe('checkPermissions', () => {
  it('should return true if permissions met', () => {
    expect(checkPermissions(readCasePrms, readCasePrms)).toBeTruthy()
  })

  it('should return false if permissions not met', () => {
    expect(
      checkPermissions(createProprietorPrms, readProprietorPrms)
    ).toBeFalsy()
  })

  it('should return false if no permissions inputted', () => {
    expect(checkPermissions(createCaseProprietorPolicyPrms)).toBeFalsy()
  })

  it('should return true if permissions extend required permissions', () => {
    expect(
      checkPermissions(createCasePrms, createCaseProprietorPolicyPrms)
    ).toBeTruthy()
  })
})

describe('checkPermissionsField', () => {
  const requiredPermissions: Permission[] = [
    {
      table: 'client',
      action: 'update',
      fields: ['email'],
    },
  ]

  const fieldName = 'email'

  it('return true when user has all required permissions and field exists', () => {
    expect(
      checkPermissionsField(requiredPermissions, fieldName, [
        {
          table: 'client',
          action: 'update',
          fields: ['email'],
        },
      ])
    ).toBeTruthy()
  })

  it('return false when user action is does not exist for a required permission', () => {
    expect(
      checkPermissionsField(requiredPermissions, fieldName, [
        {
          table: 'client',
          action: 'read',
          fields: ['firstName'],
        },
      ])
    ).toBeFalsy()
  })
  it('return false when the field does not exist for a required permission', () => {
    expect(
      checkPermissionsField(requiredPermissions, fieldName, [
        {
          table: 'client',
          action: 'update',
          fields: ['firstName'],
        },
      ])
    ).toBeFalsy()
  })

  it('return false when the params undefined  or empty', () => {
    expect(
      checkPermissionsField(requiredPermissions, fieldName, [])
    ).toBeFalsy()
    expect(
      checkPermissionsField(requiredPermissions, fieldName, undefined)
    ).toBeFalsy()
  })
})
