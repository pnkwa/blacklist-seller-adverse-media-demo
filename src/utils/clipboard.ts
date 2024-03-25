export const copyToClipboard = async (content?: string) => {
  if (!content) return undefined
  if (!navigator.clipboard)
    throw new Error('You need https to access Clipboard.')

  return navigator.clipboard.writeText(content)
}
