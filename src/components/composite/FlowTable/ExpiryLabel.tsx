import classNames from 'classnames'
import moment from 'moment'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenantConfigContext } from 'context/TenantConfigContext'
import { Flow } from 'types/caseKeeperCore'
import { dateFormats } from 'config/dateFormats'
import { dateFormat } from 'utils/date'

export const ExpiryLabel = ({ flow }: { flow: Flow }) => {
  const { t } = useTranslation()
  const { client } = useTenantConfigContext()
  const { expiresAt } = flow.backgroundCheck ?? {}

  const isExpired = useMemo(() => {
    if (!expiresAt) return false
    return moment().isAfter(expiresAt)
  }, [expiresAt])

  const isAlmostExpire = useMemo(() => {
    if (!expiresAt || isExpired) return false
    return moment()
      .add(client.backgroundCheckDashboardConfig?.almostExpireDuration)
      .isAfter(expiresAt)
  }, [
    client.backgroundCheckDashboardConfig?.almostExpireDuration,
    expiresAt,
    isExpired,
  ])

  const expiryString = useMemo(
    () =>
      t(isExpired ? 'generic.expiredAt' : 'generic.expiresIn', {
        expiry: moment(expiresAt).fromNow(),
      }),
    [expiresAt, isExpired, t]
  )

  if (!expiresAt) return null

  return (
    <span
      title={dateFormat(expiresAt, dateFormats.dayMonthYearDateTime)}
      className={classNames(
        'tag-label text-neutral bg-neutral/20 whitespace-nowrap',
        isAlmostExpire && '!text-error !bg-error/20'
      )}
    >
      {expiryString}
    </span>
  )
}
