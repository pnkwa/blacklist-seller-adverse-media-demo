import { BGCProcessResult } from './processResult'

export interface AdverseMediaResultItem {
  id: string
  link: string
  displayLink: string
  title: string
  image?: string
  description?: string
  updatedTime?: string
}

export interface AdverseMedia extends BGCProcessResult {
  searchTerm: string
  results?: AdverseMediaResultItem[]
  selectedResultIds?: string[]
}
