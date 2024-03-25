import { env } from './env'

export const routes = {
  overview: `${env.BASE_URL}/overview`,
  backgroundCheck: `${env.BASE_URL}/background-checks`,
  help: `${env.BASE_URL}/help`,
  caseDetail: `${env.BASE_URL}/case-detail/:id`,
  guide: `${env.BASE_URL}/guide`,
  settings: `${env.BASE_URL}/settings`,
  transactions: `${env.BASE_URL}/transactions`,
}
