/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_APP_TENANT_CONFIG_URL: string
  readonly VITE_APP_TENANT_CONFIG_ASSETS_URL: string
  readonly VITE_APP_CASE_KEEPER_CORE_URL: string
  readonly VITE_APP_KEYCLOAK_REALM: string
  readonly VITE_APP_KEYCLOAK_SERVICE_URL: string
  readonly VITE_APP_KEYCLOAK_CLIENT_ID: string
  readonly VITE_APP_FLOW_BASE_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
