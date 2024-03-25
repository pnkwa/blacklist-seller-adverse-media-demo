/* eslint-disable import/no-unused-modules */
import i18n from 'i18n'
import { BGCVerificationInfo } from 'types/bgcCore'
import { joinStrings } from './string'
import { getMasterdataTranslation } from './translations'

export const getFirstName = (
  verificationInfo: BGCVerificationInfo,
  language = i18n.language
) =>
  language === 'th'
    ? verificationInfo.firstNameTH
    : verificationInfo.firstNameEN

export const getLastName = (
  verificationInfo: BGCVerificationInfo,
  language = i18n.language
) =>
  language === 'th' ? verificationInfo.lastNameTH : verificationInfo.lastNameEN

export const getFullNameTh = (
  verificationInfo: BGCVerificationInfo,
  withTitle = true
) => {
  const titleTh = verificationInfo.titleTH ?? ''
  const firstName = verificationInfo.firstNameTH ?? ''
  const middleName = verificationInfo.middleNameTH ?? ''
  const lastName = verificationInfo.lastNameTH ?? ''
  return joinStrings([
    withTitle ? titleTh : '',
    firstName,
    middleName,
    lastName,
  ])
}

const getFullNameEn = (
  verificationInfo: BGCVerificationInfo,
  withTitle = true
) => {
  const titleEn = verificationInfo.titleEN ?? ''
  const firstName = verificationInfo.firstNameEN ?? ''
  const middleName = verificationInfo.middleNameEN ?? ''
  const lastName = verificationInfo.lastNameEN ?? ''
  return joinStrings([
    withTitle ? titleEn : '',
    firstName,
    middleName,
    lastName,
  ])
}

export const getVerificationInfoFullName = (
  verificationInfo: BGCVerificationInfo,
  withTitle = true,
  language = i18n.language
) => {
  const haveTH = getFullNameTh(verificationInfo, false) ? 'th' : undefined
  const haveEN = getFullNameEn(verificationInfo, false) ? 'en' : undefined
  const resultLangs = language === 'th' ? [haveTH, haveEN] : [haveEN, haveTH]
  const resultLang = resultLangs.find((item) => item)
  return resultLang === 'th'
    ? getFullNameTh(verificationInfo, withTitle)
    : getFullNameEn(verificationInfo, withTitle)
}

export const getPosition = (
  verificationInfo: BGCVerificationInfo,
  language = i18n.language
) => getMasterdataTranslation(verificationInfo.position, language)
