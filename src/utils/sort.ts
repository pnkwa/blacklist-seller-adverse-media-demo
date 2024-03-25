export const sortBackgroundCheckByKey =
  (key: string, order: 'ASC' | 'DESC' = 'DESC') =>
  (a, b) => {
    if (!a?.backgroundCheck?.[key] || !b?.backgroundCheck?.[key]) return 0

    const sortOrder = order === 'DESC' ? 1 : -1

    if (a?.backgroundCheck[key] > b?.backgroundCheck[key]) return -1 * sortOrder
    if (a?.backgroundCheck[key] < b?.backgroundCheck[key]) return 1 * sortOrder
    return 0
  }
