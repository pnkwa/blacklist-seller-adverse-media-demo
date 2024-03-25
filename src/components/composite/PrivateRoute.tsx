import { useKeycloak } from '@react-keycloak/web'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { FullScreenLoading } from 'components/base/FullScreenLoading'
import { useTenantConfigContext } from 'context/TenantConfigContext'

export const PrivateRoute: FC = () => {
  const { keycloak, initialized } = useKeycloak()
  const { client } = useTenantConfigContext()

  if (!initialized)
    return <FullScreenLoading>Authenticating...</FullScreenLoading>

  if (!keycloak.authenticated) {
    keycloak.login({ idpHint: client.provider })
    return <FullScreenLoading>Logging in...</FullScreenLoading>
  }

  keycloak.loadUserProfile()

  return <Outlet />
}
