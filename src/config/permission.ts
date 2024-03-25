/* eslint-disable import/no-unused-modules */
import { Permission } from 'types/caseKeeperCore'

// #region case
export const createCasePrms: Permission[] = [
  {
    table: 'case',
    action: 'create',
  },
]
export const readCasePrms: Permission[] = [
  {
    table: 'case',
    action: 'read',
  },
]
export const updateCasePrms: Permission[] = [
  {
    table: 'case',
    action: 'read',
  },
]
export const exportCasePrms: Permission[] = [
  {
    table: 'case',
    action: 'export',
  },
]
export const deleteCasePrms: Permission[] = [
  {
    table: 'case',
    action: 'delete',
  },
]
// #endregion

// #region client
export const updateClientPrms: Permission[] = [
  {
    table: 'client',
    action: 'update',
  },
]

export const readClientPrms: Permission[] = [
  {
    table: 'client',
    action: 'read',
  },
]
// #endregion

// #region document
export const readDocumentPrms: Permission[] = [
  {
    table: 'document',
    action: 'read',
  },
]

export const exportDocumentPrms: Permission[] = [
  {
    table: 'document',
    action: 'export',
  },
]
// #endregion

// #region event
export const readEventPrms: Permission[] = [
  {
    table: 'event',
    action: 'read',
  },
]
export const exportEventPrms: Permission[] = [
  {
    table: 'event',
    action: 'export',
  },
]
// #endregion

// #region policy
export const createPolicyPrms: Permission[] = [
  {
    table: 'policy',
    action: 'create',
  },
]
export const readPolicyPrms: Permission[] = [
  {
    table: 'policy',
    action: 'read',
  },
]
export const exportPolicyPrms: Permission[] = [
  {
    table: 'policy',
    action: 'export',
  },
]
export const deletePolicyPrms: Permission[] = [
  {
    table: 'policy',
    action: 'delete',
  },
]
// #endregion

// #region proprietor
export const createProprietorPrms: Permission[] = [
  {
    table: 'proprietor',
    action: 'create',
  },
]
export const readProprietorPrms: Permission[] = [
  {
    table: 'proprietor',
    action: 'read',
  },
]
export const exportProprietorPrms: Permission[] = [
  {
    table: 'proprietor',
    action: 'export',
  },
]
export const updateProprietorPrms: Permission[] = [
  {
    table: 'proprietor',
    action: 'update',
  },
]
export const deleteProprietorPrms: Permission[] = [
  {
    table: 'proprietor',
    action: 'delete',
  },
]
// #endregion

// #region user
export const readRolePrms: Permission[] = [
  {
    table: 'role',
    action: 'read',
  },
]
export const readGroupPrms: Permission[] = [
  {
    table: 'group',
    action: 'read',
  },
]
export const createUserPrms: Permission[] = [
  ...readRolePrms,
  ...readGroupPrms,
  {
    table: 'user',
    action: 'create',
  },
]
export const updateUserPrms: Permission[] = [
  ...readRolePrms,
  ...readGroupPrms,
  {
    table: 'user',
    action: 'update',
  },
]
export const deleteUserPrms: Permission[] = [
  {
    table: 'user',
    action: 'delete',
  },
]
// #endregion

// #region user
export const readStatusMetricPrms: Permission[] = [
  {
    table: 'status_metric',
    action: 'read',
  },
]
// #endRegion

// #region user
export const readApplicationsTransactionRulePrms: Permission[] = [
  {
    table: 'application_transaction_rule',
    action: 'read',
  },
]
export const readCurrencyPrms: Permission[] = [
  {
    table: 'currency',
    action: 'read',
  },
]
export const readTransactionPrms: Permission[] = [
  {
    table: 'transaction',
    action: 'read',
  },
]
export const readWalletPrms: Permission[] = [
  {
    table: 'wallet',
    action: 'read',
  },
]
export const readExchangePrms: Permission[] = [
  ...readApplicationsTransactionRulePrms,
  ...readCurrencyPrms,
  ...readTransactionPrms,
  ...readWalletPrms,
]
// #endRegion

// #region misc
export const createCaseProprietorPolicyPrms: Permission[] = [
  ...createCasePrms,
  ...createProprietorPrms,
  ...createPolicyPrms,
]

export const deleteCaseProprietorPolicyPrms: Permission[] = [
  ...deleteCasePrms,
  ...deletePolicyPrms,
  ...deleteProprietorPrms,
]

export const exportLinkReport: Permission[] = [
  ...readEventPrms,
  ...exportEventPrms,
]

export const exportResultReportPrms: Permission[] = [
  ...readCasePrms,
  ...exportCasePrms,
  ...readPolicyPrms,
  ...exportPolicyPrms,
  ...readProprietorPrms,
  ...exportProprietorPrms,
]

export const exportPdfPrms: Permission[] = [
  ...readCasePrms,
  ...readEventPrms,
  ...readPolicyPrms,
  ...readProprietorPrms,
  {
    table: 'pdf',
    action: 'export',
  },
]

export const exportZipPrms: Permission[] = [
  ...readDocumentPrms,
  ...exportDocumentPrms,
]

export const caseDetailPrms: Permission[] = [
  ...readCasePrms,
  ...readProprietorPrms,
  ...readPolicyPrms,
]

export const exportReportPrms: Permission[] = [
  ...exportEventPrms,
  ...exportPdfPrms,
  ...exportZipPrms,
]

export const switchSandboxModePrms: Permission[] = [
  {
    table: 'sandbox',
    action: 'switch',
  },
]
// #endregion

export const deleteFlowPrms: Permission[] = [
  {
    table: 'flow',
    action: 'delete',
  },
]
