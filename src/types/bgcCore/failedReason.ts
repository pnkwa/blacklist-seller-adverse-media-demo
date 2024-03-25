/* eslint-disable import/no-unused-modules */
import { Masterdata } from 'types/generic'

export enum CRValidations {
  MIN_JUDGEMENT_DAY = 'minJudgementDay',
}

export enum SSHValidations {
  OVER_EMPLOYED = 'overEmployed',
  MAX_YEAR_GAP = 'maxYearGap',
  JOB_SWITCH = 'jobSwitch',
  BLACKLISTED_COMPANIES = 'blacklistedCompanies',
}

export interface FailedReasonDetail {
  recordId: string
  failedTags: Masterdata[]
}

type FailedReasonKey = SSHValidations | CRValidations

export interface FailedReason {
  key: FailedReasonKey

  /**
   * Will be used in minimunJudgmentDay validation
   */
  details?: FailedReasonDetail[]

  /**
   * Will be used in overEmployed, jobSwitch, blacklistedCompanies validation
   */
  recordIds?: string[]

  /**
   * ISO 8601 duration format
   * Will be used in maxYearGap validation
   */
  yearGap?: string
}
