const STORAGE_KEY = 'kevex-guest-calculator-limit'
const WINDOW_MS = 12 * 60 * 60 * 1000

const getStoredState = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

const setStoredState = (value) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function useGuestCalculatorLimit() {
  const getLimitState = () => {
    const stored = getStoredState()

    if (!stored?.usedAt) {
      return { canUse: true, nextAvailableAt: null }
    }

    const usedAt = Number(stored.usedAt)
    const expiresAt = usedAt + WINDOW_MS

    if (Number.isNaN(usedAt) || Date.now() >= expiresAt) {
      return { canUse: true, nextAvailableAt: null }
    }

    return {
      canUse: false,
      nextAvailableAt: expiresAt
    }
  }

  const consumeUse = (calculatorId) => {
    setStoredState({
      calculatorId,
      usedAt: Date.now()
    })
  }

  return {
    getLimitState,
    consumeUse
  }
}
