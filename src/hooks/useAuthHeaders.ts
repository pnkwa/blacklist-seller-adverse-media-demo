import { useKeycloak } from '@react-keycloak/web'
import { useMemo } from 'react'

export const useAuthHeaders = (isSandbox?: boolean) => {
  const { keycloak } = useKeycloak()

  const headers = useMemo(
    () =>
      keycloak.token
        ? new Headers({
            'X-Api-Mode': isSandbox ? 'sandbox' : 'live',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloak.token}`,
          })
        : undefined,
    [keycloak.token, isSandbox]
  )

  return { headers }
}
