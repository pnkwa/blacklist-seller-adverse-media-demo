import Keycloak from 'keycloak-js'
import { env } from './env'

export const keycloak = new Keycloak({
  realm: env.KEYCLOAK_REALM || 'mac-portal',
  url: env.KEYCLOAK_SERVICE_URL || 'http://localhost:8080/auth',
  clientId: env.KEYCLOAK_CLIENT_ID || 'mac-background-check-dashboard',
})
