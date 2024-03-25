import Color from 'colorjs.io'
import { Theme } from 'types/tenantConfig'

const twoLetterAttributeColors = ['info', 'success', 'warning', 'error']

const toKebabCase = (str: string) =>
  str.replace(/([a-z])([A-Z|0-9])/g, '$1-$2').toLowerCase()

const getColorAttributeFromKey = (key: string) =>
  toKebabCase(key)
    .split('-')
    .reduce(
      (a, v) =>
        `${a}${
          twoLetterAttributeColors.includes(v)
            ? v.substring(0, 2)
            : v.substring(0, 1)
        }`,
      ''
    )

/** convert the rgb color from tenant config to `oklch()` format to comply with daisyui v4 */
const convertColorToOKLCH = (value: string) => {
  const oklch = new Color(value).to('oklch')
  return `${oklch.get('l')} ${oklch.get('c') || 0} ${oklch.get('h') || 0}`
}

export const setTailwindTheme = (theme: Theme) => {
  const htmlElementStyles = document.documentElement.style

  for (let i = htmlElementStyles.length - 1; i >= 0; i--) {
    htmlElementStyles.removeProperty(htmlElementStyles[i])
  }

  Object.keys(theme).forEach((key) => {
    const value: string | undefined = theme[key]
    if (!value) return
    document.documentElement.style.setProperty(
      `--${getColorAttributeFromKey(key)}`,
      convertColorToOKLCH(value)
    )
  })
}
