import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from '@/boot/firebase'
import { DEFAULT_PLAN_ID, getCreditPackageById, getPlanById } from '@/config/plans'

const usersCollection = collection(db, 'users')
const creditPurchasesCollection = collection(db, 'creditPurchases')

function getCurrentCycleKey() {
  const date = new Date()
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function buildDefaultBillingState() {
  return {
    planId: DEFAULT_PLAN_ID,
    quoteCredits: 0,
    monthlyQuoteUsage: 0,
    quoteCycleKey: getCurrentCycleKey(),
    lastPurchaseAt: null,
    lastPlanChangeAt: null
  }
}

export function withBillingDefaults(profile = {}) {
  return {
    ...buildDefaultBillingState(),
    ...profile
  }
}

export async function syncBillingCycle(userId) {
  const userRef = doc(usersCollection, userId)
  const cycleKey = getCurrentCycleKey()

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef)

    if (!snapshot.exists()) {
      return buildDefaultBillingState()
    }

    const data = withBillingDefaults(snapshot.data())

    if (data.quoteCycleKey === cycleKey) {
      return data
    }

    const nextState = {
      quoteCycleKey: cycleKey,
      monthlyQuoteUsage: 0,
      updatedAt: serverTimestamp()
    }

    transaction.update(userRef, nextState)

    return {
      ...data,
      ...nextState
    }
  })
}

export async function getQuoteAllowance(userId) {
  const billingState = await syncBillingCycle(userId)
  const plan = getPlanById(billingState.planId)

  return {
    billingState,
    plan,
    includedQuotesRemaining:
      plan.includedQuotes == null ? null : Math.max(plan.includedQuotes - Number(billingState.monthlyQuoteUsage || 0), 0),
    quoteCredits: Number(billingState.quoteCredits || 0)
  }
}

export async function consumeQuoteEntitlement(userId) {
  const userRef = doc(usersCollection, userId)
  const cycleKey = getCurrentCycleKey()

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef)

    if (!snapshot.exists()) {
      throw new Error('User profile is missing. Please refresh and try again.')
    }

    const data = withBillingDefaults(snapshot.data())
    const plan = getPlanById(data.planId)
    const nextData = { ...data }

    if (data.quoteCycleKey !== cycleKey) {
      nextData.quoteCycleKey = cycleKey
      nextData.monthlyQuoteUsage = 0
    }

    if (plan.includedQuotes == null) {
      transaction.update(userRef, {
        quoteCycleKey: nextData.quoteCycleKey,
        updatedAt: serverTimestamp()
      })

      return { plan, source: 'plan', remainingCredits: Number(nextData.quoteCredits || 0) }
    }

    if (Number(nextData.monthlyQuoteUsage || 0) < plan.includedQuotes) {
      const monthlyQuoteUsage = Number(nextData.monthlyQuoteUsage || 0) + 1

      transaction.update(userRef, {
        quoteCycleKey: nextData.quoteCycleKey,
        monthlyQuoteUsage,
        updatedAt: serverTimestamp()
      })

      return {
        plan,
        source: 'included',
        monthlyQuoteUsage,
        remainingCredits: Number(nextData.quoteCredits || 0)
      }
    }

    if (Number(nextData.quoteCredits || 0) > 0) {
      const quoteCredits = Number(nextData.quoteCredits || 0) - 1

      transaction.update(userRef, {
        quoteCycleKey: nextData.quoteCycleKey,
        monthlyQuoteUsage: Number(nextData.monthlyQuoteUsage || 0),
        quoteCredits,
        updatedAt: serverTimestamp()
      })

      return {
        plan,
        source: 'credit',
        remainingCredits: quoteCredits
      }
    }

    throw new Error('Starter plan limit reached. Buy credits or upgrade your plan to save more quotes.')
  })
}

export async function updateUserPlan(userId, planId) {
  const plan = getPlanById(planId)

  await updateDoc(doc(usersCollection, userId), {
    planId: plan.id,
    quoteCycleKey: getCurrentCycleKey(),
    lastPlanChangeAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  return plan
}

export async function purchaseCredits(userId, packageId) {
  const creditPackage = getCreditPackageById(packageId)

  if (!creditPackage) {
    throw new Error('Invalid credit package selected.')
  }

  const userRef = doc(usersCollection, userId)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef)

    if (!snapshot.exists()) {
      throw new Error('User profile is missing. Please refresh and try again.')
    }

    const data = withBillingDefaults(snapshot.data())
    const quoteCredits = Number(data.quoteCredits || 0) + creditPackage.credits

    transaction.update(userRef, {
      quoteCredits,
      lastPurchaseAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  })

  await addDoc(creditPurchasesCollection, {
    userId,
    packageId: creditPackage.id,
    packageName: creditPackage.name,
    credits: creditPackage.credits,
    amountTtd: creditPackage.priceTtd,
    createdAt: serverTimestamp(),
    paymentStatus: 'simulated-paid'
  })

  return creditPackage
}

export async function getCreditPurchaseHistory(userId) {
  const purchasesQuery = query(
    creditPurchasesCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(purchasesQuery)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}
