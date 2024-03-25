import { ApiError } from 'errors'

export const downloadBlobResponse =
  (filename: string) => async (res: Response) => {
    if (res.status < 400) {
      const blob = await res.blob()
      const a = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      a.href = href
      a.download = filename
      a.click()
      a.remove()
      return
    }
    const body = await res.json().catch(() => res)
    throw new ApiError(res, body)
  }

export const validateFileType = (file: File, type: string): boolean =>
  file.type.startsWith(type)
