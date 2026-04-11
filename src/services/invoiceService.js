import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from '@/boot/firebase'

const invoicesCollection = collection(db, 'invoices')

export async function createInvoice(payload) {
  const docRef = await addDoc(invoicesCollection, {
    ...payload,
    createdAt: serverTimestamp()
  })

  return docRef
}

export async function createInvoiceFromQuote(quote) {
  const amount = Number(quote.result?.costs?.total || 0)
  const issueDate = new Date()
  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + 14)

  return createInvoice({
    userId: quote.userId,
    quoteId: quote.id,
    jobId: quote.jobId ?? null,
    clientId: quote.clientId ?? null,
    clientName: quote.clientName ?? 'Unnamed Client',
    serviceName: quote.serviceName ?? '',
    invoiceTitle: quote.title || `${quote.serviceName || 'Job'} Invoice`,
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    issueDate: issueDate.toISOString(),
    dueDate: dueDate.toISOString(),
    amount,
    amountPaid: 0,
    balanceDue: amount,
    status: 'unpaid',
    lineItems: [
      ...(quote.result?.materials ?? []),
      quote.result?.labor
        ? {
            label: 'Labor',
            quantity: quote.result.labor.hours,
            unit: 'hours',
            rate: quote.result.labor.rate,
            total: quote.result.labor.total
          }
        : null
    ].filter(Boolean)
  })
}

export async function getUserInvoices(userId) {
  const invoicesQuery = query(invoicesCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(invoicesQuery)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function updateInvoice(invoiceId, payload) {
  await updateDoc(doc(db, 'invoices', invoiceId), payload)
}

export async function recordInvoicePayment(invoiceId, invoice, paymentAmount) {
  const amountPaid = Number(invoice.amountPaid || 0) + Number(paymentAmount || 0)
  const amount = Number(invoice.amount || 0)
  const balanceDue = Math.max(amount - amountPaid, 0)

  await updateDoc(doc(db, 'invoices', invoiceId), {
    amountPaid,
    balanceDue,
    status: balanceDue <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'unpaid'
  })
}

export async function deleteInvoice(invoiceId) {
  await deleteDoc(doc(db, 'invoices', invoiceId))
}
