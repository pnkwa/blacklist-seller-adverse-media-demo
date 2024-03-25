export interface Currency {
  id: string
  name: string
  displayName: string
  value: number
  iconURL?: string
  description?: string
  createdAt?: Date
}

export interface Wallet {
  id: string
  currencyId: string
  initial: number
  amount: number
  paid: boolean
  expiresAt: Date
}

interface TransactionRule {
  id: string
  name: string
  amount: number
  currency: Currency
  description?: string
}

export interface ApplicationTransactionRule {
  transactionRuleId: string
  transactionRule: TransactionRule
  count: number
}

export interface Transaction {
  id: string
  currency: Currency
  transactionRule: TransactionRule | null
  createdAt: Date
  amount: number
  ref: string
}
