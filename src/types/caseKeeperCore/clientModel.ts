/** 'Client' entity from the case-keeper-core service */
export interface ClientModel {
  isSandbox: boolean
  name: string
  provider: string
  webhookUrl?: string
}
