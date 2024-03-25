import { Flow } from 'types/caseKeeperCore'

export const getPassportFromFlow = (flow?: Flow) => {
  if (!flow) return null

  const { proprietor, verification, backgroundCheck } = flow
  const { passportNumber, passportResult } = verification ?? {}

  const result =
    backgroundCheck?.verificationInfo.passportNumber ??
    passportResult?.edits?.passportNumber ??
    passportResult?.response?.result?.mrz_passport_number ??
    passportNumber ??
    proprietor?.passportNumber

  return result?.replace(/\W/g, '')
}

export const getCitizenIdFromFlow = (flow?: Flow) => {
  if (!flow) return null
  const { proprietor, verification, backgroundCheck } = flow
  const { citizenId, frontIdCardResult } = verification ?? {}

  const result =
    backgroundCheck?.verificationInfo.citizenId ??
    frontIdCardResult?.edits?.citizenId ??
    frontIdCardResult?.response?.result?.id_number ??
    citizenId ??
    proprietor?.citizenId

  return result?.replace(/\D/g, '')
}

export const getDateOfBirthFromFlow = (flow?: Flow) => {
  if (!flow) return null
  const { proprietor, verification, backgroundCheck } = flow
  const { dateOfBirth, frontIdCardResult } = verification ?? {}

  return (
    backgroundCheck?.verificationInfo.dateOfBirth ??
    frontIdCardResult?.edits?.dateOfBirth ??
    frontIdCardResult?.response?.result?.date_of_birth_en ??
    dateOfBirth ??
    proprietor?.dateOfBirth
  )
}
