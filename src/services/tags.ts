import { env } from 'config/env'
import { Tag } from 'types/tagger/tag'
import { handleJsonResponse } from 'utils/fetch'

const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
}

export const fetchSuggestedTags = async (signal?: AbortSignal) => {
  return fetch(`${env.TAGGER_URL}/tags`, {
    method: 'GET',
    headers,
    signal,
  })
    .then(handleJsonResponse)
    .then(({ data }) => data)
}

export const putTag = async (tag: Tag) =>
  fetch(`${env.TAGGER_URL}/tags`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(tag),
  })
    .then(handleJsonResponse)
    .then(({ data }) => data)
