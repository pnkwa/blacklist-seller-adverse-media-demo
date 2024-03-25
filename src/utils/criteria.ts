import { processCriteriaFormSpecs } from 'specs/processCriteriaFormSpecs'
import {
  BackgroundCheckProcessName,
  ProcessConfigs,
  CriteriaMapping,
} from 'types/bgcCore'
import { Client, PositionConfig } from 'types/tenantConfig'

/**
 * returns a record of process name and its criteria
 * the keys will only contains the required process
 */
export const getPositionCriteriaMapping = (
  position: PositionConfig
): CriteriaMapping => {
  const result: CriteriaMapping = {}
  const processConfigs =
    position.backgroundCheck?.processConfigs ?? ({} as ProcessConfigs)
  Object.keys(processConfigs ?? {}).forEach((conf) => {
    const value = processConfigs[conf as BackgroundCheckProcessName]
    if (!value) return
    if (typeof value === 'boolean') result[conf] = undefined
    else result[conf] = value.criteria
  })
  return result
}

/**
 * returns a record of process name and their criteria
 */
export const getAllPositionsCriteriaMapping = (
  client: Client
): CriteriaMapping => {
  if (!client.backgroundCheckDashboardConfig?.positions) return {}
  return Object.values(
    client.backgroundCheckDashboardConfig?.positions
  ).reduce<CriteriaMapping>((acc, curr) => {
    /** skip if the position is just for dropping lead (freemium) */
    if (curr.leadAlias) return acc
    return { ...acc, ...getPositionCriteriaMapping(curr) }
  }, {})
}

/** apply criteria mapping to position's processConfig */
export const applyCriteria = (
  position: PositionConfig,
  criteriaMapping: CriteriaMapping
): PositionConfig => {
  if (!position.backgroundCheck?.processConfigs) return position
  Object.keys(position.backgroundCheck.processConfigs).forEach((process) => {
    if (!position.backgroundCheck?.processConfigs[process]) return
    position.backgroundCheck.processConfigs[process] = {
      ...position.backgroundCheck.processConfigs[process],
      criteria: criteriaMapping[process],
    }
  })
  return position
}

export const canConfigCriteria = (criteriaMapping: CriteriaMapping) =>
  Object.keys(criteriaMapping).some((k) =>
    processCriteriaFormSpecs.some((conf) => conf.key === k)
  )

export const validateCriteriaMapping = (
  criteriaMapping: CriteriaMapping | undefined
): boolean => {
  return Object.values(criteriaMapping ?? {}).every((criteria) => {
    if (
      criteria?.blacklistedCompanies &&
      criteria?.blacklistedCompanies.some((company) => !company.name)
    )
      return false
    return true
  })
}
