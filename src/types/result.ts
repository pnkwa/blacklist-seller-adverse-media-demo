interface Tag {
  key: string
  translations: {
    en: string
    th: string
  }
}

export interface AdverseMedia {
  displayLink: string
  id: string
  link: string
  title?: string
  category?: string
  image?: string
  description?: string
  tags: Tag[]
}

export interface BlacklistedSeller {
  createAt: string
  dataEntryDate?: string
  deletedAt?: string
  disposedPersonalDataAt?: string
  id: string
  product?: string
  sellerName?: string
  sellingPage?: string
  totalAmount?: string
  transferDate?: string
  updatedAt?: string
  url?: string
}
