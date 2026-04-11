import jsPDF from 'jspdf'

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'TTD',
    minimumFractionDigits: 2
  }).format(Number(value || 0))

export function exportInvoicePdf(invoice) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Kevex Build Tools', 20, 20)
  doc.setFontSize(12)
  doc.text('Professional Invoice', 20, 30)
  doc.text(`Invoice #: ${invoice.invoiceNumber || 'Pending'}`, 20, 40)
  doc.text(`Client: ${invoice.clientName || 'N/A'}`, 20, 48)
  doc.text(`Service: ${invoice.serviceName || 'N/A'}`, 20, 56)
  doc.text(`Status: ${invoice.status || 'unpaid'}`, 20, 64)
  doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 20, 72)
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 80)

  let y = 96
  doc.setFontSize(14)
  doc.text('Line Items', 20, y)
  y += 10
  doc.setFontSize(11)

  ;(invoice.lineItems || []).forEach((item) => {
    doc.text(
      `${item.label}: ${item.quantity} ${item.unit} x ${formatMoney(item.rate)} = ${formatMoney(item.total)}`,
      20,
      y
    )
    y += 8
  })

  y += 6
  doc.setFontSize(12)
  doc.text(`Invoice Amount: ${formatMoney(invoice.amount)}`, 20, y)
  y += 8
  doc.text(`Paid: ${formatMoney(invoice.amountPaid)}`, 20, y)
  y += 8
  doc.text(`Balance Due: ${formatMoney(invoice.balanceDue)}`, 20, y)

  const safeClient = (invoice.clientName || 'client').replace(/[^a-z0-9]/gi, '-').toLowerCase()
  doc.save(`kevex-invoice-${safeClient}.pdf`)
}
