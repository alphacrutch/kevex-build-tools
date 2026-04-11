export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    priceLabel: 'Free',
    monthlyPriceTtd: 0,
    includedQuotes: 3,
    quoteCreditsIncluded: 0,
    features: [
      '3 quotes per month',
      'Basic trade calculators',
      'Client-ready estimate summary'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$40 TTD / month',
    monthlyPriceTtd: 40,
    includedQuotes: null,
    quoteCreditsIncluded: 5,
    features: [
      'Unlimited quotes',
      'Material calculator engine',
      'PDF export and WhatsApp quote share',
      'Job tracking and templates'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    priceLabel: '$100 TTD / month',
    monthlyPriceTtd: 100,
    includedQuotes: null,
    quoteCreditsIncluded: 20,
    features: [
      'Unlimited quotes and invoices',
      'Profit tracking and client database',
      'Priority support workflow',
      'Credit bundles for larger teams'
    ]
  }
]

export const creditPackages = [
  {
    id: 'credit-pack-5',
    name: '5 Quote Credits',
    credits: 5,
    priceTtd: 25,
    description: 'Best for Starter accounts that need a few extra quotes this month.'
  },
  {
    id: 'credit-pack-15',
    name: '15 Quote Credits',
    credits: 15,
    priceTtd: 60,
    description: 'A simple mid-size top-up for teams handling several live leads.'
  },
  {
    id: 'credit-pack-40',
    name: '40 Quote Credits',
    credits: 40,
    priceTtd: 140,
    description: 'High-volume bundle for businesses quoting aggressively every week.'
  }
]

export const DEFAULT_PLAN_ID = 'starter'

export function getPlanById(planId) {
  return pricingPlans.find((plan) => plan.id === planId) ?? pricingPlans[0]
}

export function getCreditPackageById(packageId) {
  return creditPackages.find((creditPack) => creditPack.id === packageId) ?? null
}
