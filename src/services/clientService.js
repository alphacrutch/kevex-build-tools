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
  where
} from 'firebase/firestore'
import { db } from '@/boot/firebase'

const clientsCollection = collection(db, 'clients')

export async function createClient(payload) {
  const docRef = await addDoc(clientsCollection, {
    ...payload,
    createdAt: serverTimestamp()
  })

  return docRef
}

export async function getUserClients(userId) {
  const q = query(clientsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function getUserClientCount(userId) {
  const q = query(clientsCollection, where('userId', '==', userId))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function deleteClient(clientId) {
  await deleteDoc(doc(db, 'clients', clientId))
}
