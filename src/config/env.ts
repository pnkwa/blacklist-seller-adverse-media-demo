interface Window {
  config: ImportMetaEnv
}

interface EnvironmentValues {
  ARCHIVE_URL: string
  BASE_URL: string
  ENVIRONMENT: string
  TENANT_CONFIG_URL: string
  TENANT_CONFIG_ASSETS_URL: string
  CASE_KEEPER_CORE_URL: string
  KEYCLOAK_REALM: string
  KEYCLOAK_SERVICE_URL: string
  KEYCLOAK_CLIENT_ID: string
  FLOW_BASE_PATH: string
  TAGGER_URL: string
  HOT_JAR_ID: string
  isDev: boolean
  MASTERDATA_BASE_URL: string
}

declare const window: Window

const rawEnv = import.meta.env.DEV ? import.meta.env : window.config
const BASE_URL = import.meta.env.DEV
  ? import.meta.env.BASE_URL
  : window.config.PUBLIC_URL

const envValues = Object.keys(rawEnv).reduce(
  (acc, key) => ({
    ...acc,
    [key.replace('VITE_APP_', '')]: rawEnv[key] || '',
  }),
  {}
) as EnvironmentValues

export const env: EnvironmentValues = {
  ...envValues,
  BASE_URL,
  isDev: import.meta.env.DEV,
}
