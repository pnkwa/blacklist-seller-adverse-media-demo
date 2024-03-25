export const mapStreamToArray = async <T>(
  stream: ReadableStream<Uint8Array>,
  mapper: (input) => T
): Promise<T[]> => {
  const reader = stream.getReader()
  const data: T[] = []
  let tail = ''
  const handleChunk = async (
    res: ReadableStreamReadResult<Uint8Array>
  ): Promise<T[]> => {
    if (res.done) return data
    const chunk = new TextDecoder().decode(res.value)
    /** The chunks can contain multiple objects. */
    let parsed
    try {
      parsed = JSON.parse(`[${tail}${chunk.replace(/\}\{/g, '},{')}]`)
      tail = ''
    } catch (e) {
      const index = chunk.lastIndexOf('}{')
      if (index === -1) {
        tail += chunk
        return reader.read().then(handleChunk)
      }
      parsed = JSON.parse(
        `[${tail}${chunk.slice(0, index + 1).replace(/\}\{/g, '},{')}]`
      )
      tail = chunk.slice(index + 1)
    }
    data.push(...parsed.map(mapper))
    return reader.read().then(handleChunk)
  }
  return reader.read().then(handleChunk)
}
