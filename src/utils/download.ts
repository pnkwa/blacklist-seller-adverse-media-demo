import { unparse } from 'papaparse'
import { utils as XLSXUtils, writeXLSX } from 'xlsx'
import { unparseConfig } from 'config/csv'
import { SpreadsheetMimetype } from 'types/generic/spreadsheet'
import { ApiError } from 'errors'

export const getFilenameFromURL = (url: string): string => {
  const { pathname } = new URL(url)
  return decodeURIComponent(pathname.split('/').splice(-1)[0])
}

export const downloadURL = (url: string, fileName: string) => {
  const link = document.createElement('a')
  link.setAttribute('target', '_blank')
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

export const downloadFile = (
  blobPart: BlobPart,
  filename: string,
  mimetype?: string
) => {
  const blob = new Blob([blobPart], { type: mimetype })
  const url = window.URL.createObjectURL(blob)
  downloadURL(url, filename)
}

export const downloadBlobFromUrl = async (
  url: string,
  fileName?: string,
  mimetype?: string
) => {
  if (!fileName) {
    fileName = getFilenameFromURL(url)
  }
  const res = await fetch(url)
  if (res.status >= 400) {
    const resBody = await res.json().catch(() => res)
    throw new ApiError(res, resBody)
  }
  const arrayBuffer = await res.arrayBuffer()
  downloadFile(arrayBuffer, fileName, mimetype)
}

const createSpreadSheet = (
  data: unknown[],
  mimetype: SpreadsheetMimetype
): BlobPart | null => {
  switch (mimetype) {
    case 'text/csv': {
      return unparse(data, unparseConfig)
    }
    case 'application/vnd.ms-excel': {
      const worksheet = XLSXUtils.json_to_sheet(data)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] }
      return writeXLSX(workbook, {
        type: 'array',
      })
    }
    default:
      return null
  }
}
export const downloadSpreadSheet = (
  data: unknown[],
  filename: string,
  mimetype: SpreadsheetMimetype
) => {
  const blobPart = createSpreadSheet(data, mimetype)
  return blobPart && downloadFile(blobPart, filename, mimetype)
}
