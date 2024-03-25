export const getFullNationality = async (
  countryCode: string | undefined
): Promise<string | undefined> => {
  try {
    if (!countryCode) return undefined
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name`
    )
    if (res.status >= 200 && res.status < 400) {
      const data = await res.json()
      return data.name.common
    }
    throw new Error(`Request failed with status code ${res.status}`)
  } catch (e) {
    console.error(e)
    return countryCode
  }
}
