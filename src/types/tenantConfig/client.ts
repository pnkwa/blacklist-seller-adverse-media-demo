import { FieldConfig, Masterdata, SupportedLng } from 'types/generic'
import { VerificationInput } from 'types/kycCore'
import { BackgroundCheckInput } from 'types/bgcCore'
import { Theme } from './theme'

export interface PositionConfig {
  position?: Masterdata
  verification?: VerificationInput
  backgroundCheck?: BackgroundCheckInput
  formKey?: string
  flowName?: string
  packageCode?: string
  leadAlias?: string
}

export interface CreateLinkFormConfig {
  fields?: FieldConfig[]
}

export enum ProprietorSearchFields {
  NAME = 'name',
  CITIZEN_ID = 'citizenId',
  CONTACT = 'contact',
}

export type OverridingTranslations = Partial<
  Record<SupportedLng, Record<string, unknown>>
>

interface BackgroundCheckDashboardConfig {
  createLinkForms?: Record<string, CreateLinkFormConfig>
  positions?: Record<string, PositionConfig>
  translations?: OverridingTranslations
  almostExpireDuration?: string
  displayTotalCaseFlowColumns?: string[]
  displayPendingClientCaseFlowColumns?: string[]
  displayKycNotVerifiedFlowColumns?: string[]
  displayPendingResultFlowColumns?: string[]
  displayReceivedResultFlowColumns?: string[]
  rejectionReasons?: Masterdata[]
  approvalReasons?: Masterdata[]
  totalCaseFlowFilterOptions?: string[]
  kycNotVerifiedFlowFilterOptions?: string[]
  pendingClientCaseFlowFilterOptions?: string[]
  pendingResultFlowFilterOptions?: string[]
  receivedResultFlowFilterOptions?: string[]
  totalCaseFlowSearchFields?: string[]
  kycNotVerifiedFlowSearchFields?: string[]
  pendingClientFlowSearchFields?: string[]
  pendingResultFlowSearchFields?: string[]
  receivedResultFlowSearchFields?: string[]
  // TODO: Add new field in tenant
  masterdatas?: MasterdataLinks
  bgcSummaryReportLanguages?: string[]
}

interface BackgroundCheckDashboardFeatures {
  useCriteriaSettingsByPosition?: boolean
}

export interface CaseKeeperConfig {
  archivePublicKey?: string
  webhookUrl?: string
  ccDashboardWatermarkText?: string
  evDashboardWatermarkText?: string
  displayCurrencies?: string[] | null
}

export interface KycCoreFeature {
  useChangeThemeButton?: boolean
  useChangeLanguageButton?: boolean
}

export interface Client {
  id: string
  name?: string
  displayName?: string
  logo?: string
  darkLogo?: string
  provider?: string
  providerUrl?: string
  theme?: Theme
  backgroundCheckDashboardConfig?: BackgroundCheckDashboardConfig
  backgroundCheckDashboardFeatures?: BackgroundCheckDashboardFeatures
  caseKeeperConfig?: CaseKeeperConfig
  kycCoreFeatures?: KycCoreFeature
  logoutRedirectUrl?: string
  companyName?: {
    th: string
    en: string
  }
  fontFamily?: FontConfig
}

export interface ClientConfig {
  documents?: { logo?: File; darkLogo?: File }
  theme?: Theme
  fontFamily?: FontConfig
  useChangeThemeButton?: boolean
  useChangeLanguageButton?: boolean
}

export interface MasterdataLinks {
  fontConfigs?: string
  criminalRecordTypes?: string
}

interface FontFace {
  name: string
  url: string
  weight: string
}

export type FontSize = string | [string, string]

export interface FontConfig {
  family?: string
  faces?: FontFace[]
  size?: Record<string, FontSize>
}

export interface Masterdatas {
  fontConfigs?: FontConfig[]
  criminalRecordTypes?: Masterdata[]
}
