import { TAG_VALIDATION } from 'utils/regex'

export const isValidTag = (tag: string) => {
  return !tag.match(TAG_VALIDATION)
}
