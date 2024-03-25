interface DirectusFile {
  directusFilesId: {
    id: string
  }
}

export interface Lead {
  id?: string
  alias?: string
  featureName?: string
  titleTh?: string
  titleEn?: string
  descriptionTh?: string
  descriptionEn?: string
  imagesTh?: (DirectusFile & string)[]
  imagesEn?: (DirectusFile & string)[]
  contact?: string
}
