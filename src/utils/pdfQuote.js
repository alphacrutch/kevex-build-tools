import jsPDF from 'jspdf'

const prettify = (value) =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

export function exportQuotePdf(quote) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFontSize(18)
  doc.text('Kevex ProBuild Suite', 20, 20)
  doc.setFontSize(12)
  doc.text('Professional Job Estimate', 20, 30)
  doc.text(`Client: ${quote.clientName || 'N/A'}`, 20, 40)
  doc.text(`Service: ${quote.serviceName || 'N/A'}`, 20, 48)
  doc.text(`Status: ${quote.status || 'draft'}`, 20, 56)

  let y = 72

  doc.setFontSize(14)
  doc.text('Estimate Metrics', 20, y)
  y += 10
  doc.setFontSize(11)

  Object.entries(quote.result?.metrics || {}).forEach(([key, value]) => {
    doc.text(`${prettify(key)}: ${value}`, 20, y)
    y += 8
  })

  y += 6
  doc.setFontSize(14)
  doc.text('Cost Breakdown', 20, y)
  y += 10
  doc.setFontSize(11)

  Object.entries(quote.result?.costs || {}).forEach(([key, value]) => {
    doc.text(`${prettify(key)}: ${formatMoney(value)}`, 20, y)
    y += 8
  })

  y += 8
  doc.setDrawColor(209, 213, 219)
  doc.line(20, y, pageWidth - 20, y)
  y += 10
  doc.setFontSize(10)
  doc.text('Prepared by Kevex Solutions', 20, y)

  const safeClient = (quote.clientName || 'client').replace(/[^a-z0-9]/gi, '-').toLowerCase()
  doc.save(`kevex-quote-${safeClient}.pdf`)
}
