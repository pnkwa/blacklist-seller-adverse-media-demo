export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts && parts.length) {
    return parts.pop()?.split(';').shift()
  }

  return undefined
}
