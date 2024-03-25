import { env } from 'config/env'
import { Client, Lead } from 'types/tenantConfig'
import { handleJsonResponse } from 'utils/fetch'

const fields = [
  'case_keeper_config',
  'background_check_dashboard_config',
  'background_check_dashboard_features',
  'kyc_core_features',
  'id',
  'name',
  'provider',
  'logo',
  'dark_logo',
  'display_name',
  'theme',
  'font_family',
  'logout_redirect_url',
  'company_name',
].join(',')

interface FetchTenantResponse {
  data: Client[]
}

interface FetchLeadConfigResponse {
  data: Lead[]
}

/**
 * Use Fetch instead of Directus SDK to get the client, because:
 * - Directus SDK will automatically add a JWT token to the request, which is not needed for the client
 */
export const fetchTenantData = async (
  filter: unknown,
  signal?: AbortSignal
): Promise<FetchTenantResponse> => {
  const url = env.TENANT_CONFIG_URL
  if (!url) throw new Error('TENANT_CONFIG_URL not configured')

  const search = new URLSearchParams({
    fields,
    filter: JSON.stringify(filter),
  })

  return fetch(`${url}/items/client?${search}`, {
    headers: { 'x-accept-case': 'camelCase' },
    signal,
  }).then(handleJsonResponse)
}

export const fetchLeadData = async (
  signal?: AbortSignal
): Promise<FetchLeadConfigResponse> => {
  const url = env.TENANT_CONFIG_URL
  if (!url) throw new Error('TENANT_CONFIG_URL not configured')

  const search = new URLSearchParams({
    fields: '*.directus_files_id.*',
  })

  return fetch(`${url}/items/lead_config?${search}`, {
    headers: { 'x-accept-case': 'camelCase' },
    signal,
  }).then(handleJsonResponse)
}
