import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore'
import { db } from '@/boot/firebase'

const jobsCollection = collection(db, 'jobs')

export async function createJob(payload) {
  const docRef = await addDoc(jobsCollection, {
    ...payload,
    createdAt: serverTimestamp()
  })

  return docRef
}

export async function createJobFromQuote(quote) {
  return createJob({
    userId: quote.userId,
    quoteId: quote.id,
    clientName: quote.clientName || '',
    serviceId: quote.serviceId,
    serviceName: quote.serviceName,
    quotedTotal: Number(quote.result?.costs?.total || 0),
    actualExpenses: 0,
    amountReceived: 0,
    profit: 0,
    status: 'active'
  })
}

export async function getUserJobs(userId) {
  const q = query(jobsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function getUserJobSummary(userId) {
  const jobs = await getUserJobs(userId)
  return jobs.reduce(
    (summary, job) => {
      summary.totalJobs += 1
      summary.totalProfit += Number(job.profit || 0)
      return summary
    },
    { totalJobs: 0, totalProfit: 0 }
  )
}
