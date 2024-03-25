import { BackgroundCheckProcessName } from './processName'

export interface BlacklistedCompany {
  id?: string
  name: string
  within: string
}

export interface ProcessCriteria {
  /**
   * [criminalRecord]
   * A configuration specifying the minimum temporal distance from the validated date.
   * until the judgment day for various criminal record types.
   *
   * - The key represents the criminal record type (e.g., drug, gambling).
   * - The value can be:
   *   - A temporal duration (e.g., 'P2Y'): The minimum time between the validated date and the judgment day. Validation fails if a record exists within this duration.
   *   - `null`: The result will NOT PASS if there is any record of the specified criminal record type, regardless of the judgment day.
   *   - `'any'`: The result will PASS if there is any record of the specified criminal type, regardless of the judgment day.
   *
   * example config: `{ gambling: 'P2Y', theft: 'any', drug: null }`
   */
  minJudgementDay?: Record<string, string | 'any' | null>

  // ssh
  /**
   * [socialSecurityHistory]
   * - If true, the result will not pass if there is any employment period overlapping with another.
   * - If false or undefined, this criteria will not be validated.
   */
  overEmployed?: boolean

  /**
   * [socialSecurityHistory]
   * A temporal duration specifying the maximum year gap between the latest job resignation and the validation date
   * If null or undefined, this criteria will not be validated
   */
  maxYearGap?: string | null

  /**
   * [socialSecurityHistory]
   * Configuration to specify criteria for job switching
   * - `lessThan`: The maximum number of job switches allowed within the specified time frame.
   * - `within`: The temporal duration during which the job switches are considered.
   * example config: `{ lessThan: 2, within: 'P1Y' }`
   */
  jobSwitch?: {
    lessThan: number
    within: string
  }

  /**
   * [socialSecurityHistory]
   * Configuration to specify blacklisted companies and the time frame within which they are considered
   * - `name`: The name of the blacklisted company.
   * - `within`: The temporal duration during which the association with the blacklisted company is considered.
   * example config: `[{ name: 'company A', within: 'P1Y' }, { name: 'company B', within: 'P1Y' }]`
   */
  blacklistedCompanies?: BlacklistedCompany[]
}

export type CriteriaMapping = Partial<
  Record<BackgroundCheckProcessName, ProcessCriteria | undefined>
>
