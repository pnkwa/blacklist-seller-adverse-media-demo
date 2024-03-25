interface CreditBase {
  total: number
  remaining: number
}

export interface Credit extends CreditBase {
  notifyThreshold: number
}

export interface CreditMeta extends CreditBase {
  count: number
  exceededThreshold: number
}
