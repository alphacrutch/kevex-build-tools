import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/boot/firebase'

export async function createUserProfile(userId, payload) {
  const userRef = doc(db, 'users', userId)

  await setDoc(userRef, {
    ...payload,
    onboardingCompleted: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function getUserProfile(userId) {
  const snapshot = await getDoc(doc(db, 'users', userId))

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}

export async function updateUserProfile(userId, payload) {
  await updateDoc(doc(db, 'users', userId), {
    ...payload,
    updatedAt: serverTimestamp()
  })
}
