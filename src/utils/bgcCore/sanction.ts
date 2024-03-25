export const getSanctionUnions = <T extends { sanctionBy: string }>(
  lists: T[]
) =>
  ['UN', 'EU', 'HM'].filter((item) =>
    [...new Set(lists.map((item) => item.sanctionBy))].includes(item)
  )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertDuplicateSanctionFields = (lists: any[], key: string) => [
  ...new Set(
    lists.flatMap((list) => {
      if (Array.isArray(list[key])) {
        const [item] = list[key]
        if (key === 'identificationDocuments') {
          const { type, number } = item
          return [type, number].join(' - ')
        }
        if (key === 'birthDate') {
          const { dateOfBirth, monthOfBirth, yearOfBirth } = item
          return [dateOfBirth, monthOfBirth, yearOfBirth].join('-')
        }
      }
      return list[key]
    })
  ),
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanctionsData = (fields: string[], lists: any[]) => {
  return fields.reduce(
    (acc, key: string) => ({
      ...acc,
      [key]: convertDuplicateSanctionFields(lists, key),
    }),
    {}
  )
}

export const getIdentificationData = (key: string, data): string => {
  if (!data) return '-'
  if (!data[key] || !data[key].length) return '-'
  if (['birthDate', 'identificationDocuments'].includes(key))
    return data?.[key].join('; ')
  return data?.[key].map((list?: string) => `${list}\n`).join('')
}
