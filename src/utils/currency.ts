export const formatCurrency = (currency?: number | string | null) => {
  return (currency || currency === 0) &&
    !Number.isNaN(Number.parseFloat(currency.toString()))
    ? Number.parseFloat(currency.toString()).toLocaleString('en-US')
    : null
}
