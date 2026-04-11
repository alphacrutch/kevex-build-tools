import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/boot/firebase'
import { buildDefaultBillingState } from './billingService'

function buildWorkspaceDefaults(payload) {
  return {
    ...buildDefaultBillingState(),
    companyCurrency: 'TTD',
    invoicePrefix: 'INV',
    quotePrefix: 'QTE',
    whatsappNumber: '',
    ...payload
  }
}

export async function createUserProfile(userId, payload) {
  const userRef = doc(db, 'users', userId)

  await setDoc(userRef, {
    ...buildWorkspaceDefaults(payload),
    onboardingCompleted: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function ensureUserProfile(userId, payload) {
  const userRef = doc(db, 'users', userId)
  const snapshot = await getDoc(userRef)

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data()
    }
  }

  await setDoc(userRef, {
    ...buildWorkspaceDefaults(payload),
    onboardingCompleted: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  return {
    id: userId,
    ...payload,
    onboardingCompleted: true
  }
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
