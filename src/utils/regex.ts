/* eslint-disable max-len */
export const MOBILE_PHONE_VALIDATION = /^(\d{3})(\d{3})(\d{4})$/

export const ENGLISH_ALPHABET = /^[A-z.()-]+(\s[A-z.()-]+){0,2}$/

export const THAI_ALPHABET =
  /^[\u0E00-\u0E7F.()-]+(\s[\u0E00-\u0E7F.()-]+){0,2}$/

/** a-z, A-Z, ก-ฮ */
export const ANY_LANG_CONSONANTS = /\w|[\u0E01-\u0E2E]/

export const EMAIL =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/

export const PASSPORT_NUMBER = /^(?!^0+$)[a-zA-Z0-9]{6,12}$/

export const NUMBER_ONLY = /^[0-9]*$/

export const NOT_NUMBERS = /\D/g

export const LINK_HTTPS = /^https:\/\/[^/]{2}.*$/i

export const SPACE_BAR = /\s+/g

export const TAG_VALIDATION = /^(?=.*[@#$%^&*!]|\D*\d{5}\D*).*$/
