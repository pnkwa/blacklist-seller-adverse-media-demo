import { BGCProcessResult } from './processResult'

interface BirthDate {
  dateOfBirth: number
  yearBetween: number[]
  yearOfBirth: number
  monthOfBirth: number
  isApproximately: number
}

interface IdentificationDocuments {
  note: string
  type: string
  number: string
  issueDate: string
  countryOfIssuer: string | null
}

export interface SanctionedPerson {
  aliases: string[]
  gender: string | null
  remark: string[]
  matchBy: string[]
  birthDate: BirthDate
  sanctionBy: string
  citizenship: string
  identificationDocuments: IdentificationDocuments
}

export interface Sanction extends BGCProcessResult {
  persons: SanctionedPerson[]
}
