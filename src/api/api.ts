interface RequestOptions {
  method: string
  headers: {
    'Content-Type': string
    Authorization: string
  }
  body?: string
}

export const createDemo = async <T>(
  url: string,
  apiKey?: string,
  body?: Record<string, unknown>
) => {
  const requestOptions: RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  }

  try {
    const response = await fetch(url, requestOptions)
    return (await response.json()) as T
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const reloadBackgroundCheckData = async (
  apiKey?: string,
  bgcUrl?: string,
  backgroundCheckId?: string
) => {
  try {
    if (!backgroundCheckId) return []

    const requestOptions: RequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      method: 'GET',
    }

    const response = await fetch(
      `${bgcUrl}/backgroundChecks/${backgroundCheckId}`,
      requestOptions
    )

    if (!response.ok) {
      throw new Error('Failed to fetch background check data')
    }

    const data = await response.json()
    const { results } = data.adverseMedia || {}

    return results || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}
