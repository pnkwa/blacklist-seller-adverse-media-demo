import moment from 'moment'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { OverridingTranslations } from 'types/tenantConfig'
import { SupportedLng } from 'types/generic'
import { getCookie } from 'utils/cookies'
import { env } from 'config/env'

const prefLang = getCookie('i18next')
const supportedLngs: SupportedLng[] = ['en', 'th']

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: prefLang ?? window.navigator.language.split('-')[0],
    supportedLngs,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['cookie', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: `${env.BASE_URL}/locales/{{lng}}/{{ns}}.json`,
      requestOptions: {
        cache: 'no-cache',
      },
    },
  })

i18n.on('languageChanged', (lang) => {
  moment.locale(lang)
  document.documentElement.setAttribute('lang', lang)
})

export const overrideTranslations = (
  trans: OverridingTranslations | undefined
) => {
  if (!trans) return
  Object.keys(trans).forEach((lang) => {
    i18n.addResourceBundle(lang, 'translation', trans[lang], true, true)
  })
}

export default i18n
