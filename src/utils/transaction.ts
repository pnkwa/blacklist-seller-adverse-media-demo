import moment from 'moment'
import { Wallet } from 'types/exchange/transaction'

export const getWalletBalance = (wallets: Wallet[]) =>
  wallets.reduce((acc, cur) => {
    if (moment().isAfter(cur?.expiresAt)) return acc
    return acc + cur.amount
  }, 0)
