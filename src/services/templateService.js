import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore'
import { db } from '@/boot/firebase'

const templatesCollection = collection(db, 'quoteTemplates')

export async function createQuoteTemplate(payload) {
  const docRef = await addDoc(templatesCollection, {
    ...payload,
    createdAt: serverTimestamp()
  })

  return docRef
}

export async function getUserQuoteTemplates(userId) {
  const templatesQuery = query(templatesCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(templatesQuery)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function deleteQuoteTemplate(templateId) {
  await deleteDoc(doc(db, 'quoteTemplates', templateId))
}
