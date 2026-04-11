export function useCurrency() {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TTD',
    minimumFractionDigits: 2
  })

  const formatCurrency = (value) => formatter.format(Number(value || 0))

  return { formatCurrency }
}
