import { SupportedLng } from './i18n'

/** a simplified translation object. example: `{ th: 'แมว', en: 'Cat' }` */
export type Translations = Partial<Record<SupportedLng, string>>

/**
 * @deprecated a translations object in legacy format. example:
 * `{ th: { label: 'แมว' }, en: { label: 'Cat' } }`
 */
export type LegacyTranslations = Partial<
  Record<SupportedLng, Record<string, string>>
>

/**
 * the simplified format of masterdata object. example:
   ```
   {
      key: 'cat',
      translations: { th: 'แมว', en: 'Cat' },
   }
  ```
 */
export interface Masterdata {
  key: string
  code?: string
  translations?: Translations
}

/**
 * @deprecated a masterdata object in legacy format. example:
  ```
   {
      key: 'cat',
      code: '001',
      translations: { th: { label: 'แมว' }, en: { label: 'Cat' } },
   }
  ```
 */
export interface LegacyMasterdata {
  code?: string
  key?: string
  translations?: LegacyTranslations
}
