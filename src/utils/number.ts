export const getPercentage = (value: number, total: number) =>
  (value / total) * 100

export const calculatePreviousCountChanges = (
  resultCount: number,
  previousPeriodCount: number
) => {
  if (resultCount === undefined || previousPeriodCount === undefined)
    return undefined
  const diff = resultCount - previousPeriodCount
  const percentDiff = getPercentage(diff, previousPeriodCount)
  return { diff, percentDiff }
}
