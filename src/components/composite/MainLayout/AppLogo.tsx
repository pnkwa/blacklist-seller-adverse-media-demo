import { useMemo } from 'react'
import classNames from 'classnames'
import { useTenantConfigContext } from 'context/TenantConfigContext'

interface AppLogoProps {
  className?: string
}

export const AppLogo = ({ className }: AppLogoProps) => {
  const { client } = useTenantConfigContext()
  const url = useMemo(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    () => client.darkLogo || client.logo,
    [client.darkLogo, client.logo]
  )
  if (!url) return null
  return (
    <img
      alt="logo"
      src={url}
      className={classNames(
        'max-w-[160px] max-h-[36px] sm:max-h-[40px] object-contain transition-all',
        className
      )}
    />
  )
}
