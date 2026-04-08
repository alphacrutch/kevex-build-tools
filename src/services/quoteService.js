import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from '@/boot/firebase'

const quotesCollection = collection(db, 'quotes')

export async function createQuote(payload) {
  const docRef = await addDoc(quotesCollection, {
    ...payload,
    createdAt: serverTimestamp()
  })

  return docRef
}

export async function getUserQuotes(userId) {
  const q = query(quotesCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function getUserQuoteCount(userId) {
  const q = query(quotesCollection, where('userId', '==', userId))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function updateQuoteStatus(quoteId, status) {
  await updateDoc(doc(db, 'quotes', quoteId), { status })
}

export async function deleteQuote(quoteId) {
  await deleteDoc(doc(db, 'quotes', quoteId))
}
