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
    clientId: quote.clientId ?? null,
    title: quote.title || `${quote.serviceName} Job`,
    clientName: quote.clientName || '',
    serviceId: quote.serviceId,
    serviceName: quote.serviceName,
    quotedTotal: Number(quote.result?.costs?.total || 0),
    actualExpenses: 0,
    amountReceived: 0,
    profit: 0,
    stage: 'quoted',
    status: 'active',
    notes: ''
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
      summary.amountReceived += Number(job.amountReceived || 0)
      return summary
    },
    { totalJobs: 0, totalProfit: 0, amountReceived: 0 }
  )
}

export async function updateJob(jobId, payload) {
  await updateDoc(doc(db, 'jobs', jobId), payload)
}

export async function deleteJob(jobId) {
  await deleteDoc(doc(db, 'jobs', jobId))
}
