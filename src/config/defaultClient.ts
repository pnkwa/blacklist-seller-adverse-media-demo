/* eslint-disable max-len */
import { Client } from 'types/tenantConfig'
import { env } from 'config/env'

export const defaultClient: Pick<Client, 'backgroundCheckDashboardConfig'> = {
  backgroundCheckDashboardConfig: {
    masterdatas: {
      fontConfigs: `${env.MASTERDATA_BASE_URL}/masterdata/fontMasterDatas.json`,
      criminalRecordTypes: `${env.MASTERDATA_BASE_URL}/masterdata/criminalRecordTypes.json`,
    },
    almostExpireDuration: 'P4D',
  },
}
