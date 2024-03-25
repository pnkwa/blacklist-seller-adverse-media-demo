import i18n from 'i18n'
import { LegacyMasterdata, Masterdata } from 'types/generic'

export const isLegacyMasterdata = (
  valueObject
): valueObject is LegacyMasterdata =>
  typeof valueObject?.translations?.th === 'object' ||
  typeof valueObject?.translations?.en === 'object'

export const getMasterdataTranslation = (
  valueObject: Masterdata | LegacyMasterdata | undefined,
  language = i18n.language
) => {
  if (isLegacyMasterdata(valueObject))
    return language === 'th'
      ? valueObject?.translations?.th?.label
      : valueObject?.translations?.en?.label
  return language === 'th'
    ? valueObject?.translations?.th
    : valueObject?.translations?.en
}

export const getCodeFromMasterdata = (
  valueObject: Masterdata | LegacyMasterdata | undefined,
  language = i18n.language
) =>
  valueObject?.code === 'OTHER'
    ? getMasterdataTranslation(valueObject, language)
    : valueObject?.code
