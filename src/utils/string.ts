import { ANY_LANG_CONSONANTS, NOT_NUMBERS } from './regex'

/** (former "displayName" function) join strings together */
export const joinStrings = (
  values: (string | null | undefined)[],
  joiner = ' '
) =>
  values
    .filter((x) => !!x)
    .join(joiner)
    .trim()
    .replace(/\s+/g, ' ')

/** return a first letter from string, will priority a consonant first */
export const getFirstLetter = (v: string | undefined) =>
  v?.match(ANY_LANG_CONSONANTS)?.[0] ?? v?.slice(0, 1) ?? ''

export const getUniqueStrings = (inputArray: string[]): string[] => {
  const uniqueStrings: string[] = [...new Set(inputArray)]
  return uniqueStrings
}

export const maskCitizenId = (mask?: string | null) => {
  if (!mask) return '-'
  const numbers = mask.replace(NOT_NUMBERS, '')
  return `X-XXXX-XXXX${numbers.slice(-4, -1)}-${numbers.slice(-1)}`
}

export const parsePhoneNumber = (value?: string | null) => {
  if (!value) return '-'
  return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`
}
