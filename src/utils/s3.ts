import moment from 'moment'

export const isS3URLExpired = (url: string): boolean => {
  const urlSearchParams = new URL(url)
  const [amzDate, expiredDuration] = ['X-Amz-Date', 'X-Amz-Expires'].map(
    (key) => urlSearchParams.searchParams.get(key)
  )

  if (!moment(amzDate).isValid() || Number.isNaN(Number(expiredDuration)))
    return false
  const expiresAt = moment.utc(amzDate).add(expiredDuration, 'seconds')
  return moment().isSameOrAfter(expiresAt)
}
