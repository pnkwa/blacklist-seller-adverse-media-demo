/* eslint-disable import/no-dynamic-require */
import i18n from 'i18next'
import { Masterdata } from 'types/generic'
import { Client } from 'types/tenantConfig'

export const getMasterData = (source: string, client?: Client) =>
  client?.backgroundCheckDashboardConfig?.[source] ||
  require(`./${source}.json`)

export const getTitleData = (source: string, client?: Client) =>
  client?.caseKeeperConfig?.[source] || require(`./${source}.json`)

export const findByMasterdataValue = (
  masterdata: Masterdata,
  findBy: string
) => {
  if (masterdata.key === findBy) return true
  if (!masterdata.translations) return false
  const transKeys = Object.keys(masterdata.translations)
  return transKeys.some((tk) =>
    ['value', 'label', 'name'].some(
      (k) => masterdata.translations?.[tk]?.[k] === findBy
    )
  )
}

export const getTitleDataValue = (
  source: string,
  key: string,
  client?: Client
): Masterdata | undefined =>
  getTitleData(source, client).find((v) => findByMasterdataValue(v, key))

export const getDropDownValues = (
  optionsSource: string,
  label?: string,
  client?: Client
) =>
  getTitleData(optionsSource, client)
    .filter(
      (item: Masterdata) =>
        !!item.translations?.[i18n.language] &&
        item.translations[i18n.language][label ?? 'label']
    )
    .map((item: Masterdata) => ({
      ...item,
      value: item.key,
      label: item.translations?.[i18n.language][label ?? 'label'],
    }))
