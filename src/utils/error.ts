/** AbortError happens when we cancel the fetch request by using the AbortController signal */
export const isAbortError = (err): err is DOMException =>
  err instanceof DOMException && err.name === 'AbortError'
