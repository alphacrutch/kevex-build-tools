<template>
  <section class="billing-page">
    <div class="hero card">
      <div class="page-header">
        <h2>Billing & Credits</h2>
        <p>Choose a plan, top up quote credits, and keep your team moving when lead volume spikes.</p>
      </div>

      <div class="summary-strip">
        <div class="summary-chip">
          <span>Current plan</span>
          <strong>{{ activePlan.name }}</strong>
        </div>
        <div class="summary-chip">
          <span>Credits available</span>
          <strong>{{ profile?.quoteCredits || 0 }}</strong>
        </div>
        <div class="summary-chip">
          <span>Monthly usage</span>
          <strong>{{ profile?.monthlyQuoteUsage || 0 }}</strong>
        </div>
      </div>
    </div>

    <div class="billing-grid">
      <section class="panel card">
        <div class="page-header compact-header">
          <h2>Plans</h2>
          <p>Switch plans instantly. Checkout is simulated for now so the wallet flow is ready for a real gateway later.</p>
        </div>

        <div class="plan-grid">
          <article v-for="plan in pricingPlans" :key="plan.id" class="plan-card card">
            <p class="plan-name">{{ plan.name }}</p>
            <h3>{{ plan.priceLabel }}</h3>
            <ul class="feature-list">
              <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
            </ul>
            <BaseButton
              :variant="activePlan.id === plan.id ? 'outline' : 'primary'"
              :disabled="activePlan.id === plan.id || savingPlan"
              @click="changePlan(plan.id)"
            >
              {{ activePlan.id === plan.id ? 'Current Plan' : 'Activate Plan' }}
            </BaseButton>
          </article>
        </div>
      </section>

      <section class="panel card">
        <div class="page-header compact-header">
          <h2>Quote Credits</h2>
          <p>Starter accounts can use these after the free monthly quota is consumed.</p>
        </div>

        <div class="credit-grid">
          <article v-for="creditPack in creditPackages" :key="creditPack.id" class="credit-card card">
            <strong>{{ creditPack.name }}</strong>
            <p>{{ creditPack.description }}</p>
            <span>{{ formatCurrency(creditPack.priceTtd) }}</span>
            <BaseButton :loading="buyingPackageId === creditPack.id" @click="buyCredits(creditPack.id)">
              Buy Credits
            </BaseButton>
          </article>
        </div>
      </section>
    </div>

    <section class="panel card">
      <div class="page-header compact-header">
        <h2>Purchase History</h2>
        <p>Recent simulated credit purchases recorded to Firestore.</p>
      </div>

      <div v-if="!purchaseHistory.length" class="empty-state">No credit purchases yet.</div>
      <div v-else class="history-grid">
        <div v-for="purchase in purchaseHistory" :key="purchase.id" class="summary-row">
          <span>{{ purchase.packageName }} | {{ formatDate(purchase.createdAt) }}</span>
          <strong>{{ purchase.credits }} credits</strong>
        </div>
      </div>

      <p v-if="feedbackMessage" class="helper-text feedback">{{ feedbackMessage }}</p>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { creditPackages, getPlanById, pricingPlans } from '@/config/plans'
import { useCurrency } from '@/composables/useCurrency'
import { getCreditPurchaseHistory, purchaseCredits, updateUserPlan } from '@/services/billingService'
import { getUserProfile } from '@/services/userProfileService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { formatCurrency } = useCurrency()
const profile = ref(null)
const purchaseHistory = ref([])
const feedbackMessage = ref('')
const savingPlan = ref(false)
const buyingPackageId = ref('')

const activePlan = computed(() => getPlanById(profile.value?.planId))

const loadBilling = async () => {
  if (!authStore.userId) {
    return
  }

  const [profileRecord, history] = await Promise.all([
    getUserProfile(authStore.userId),
    getCreditPurchaseHistory(authStore.userId)
  ])

  profile.value = profileRecord
  purchaseHistory.value = history
}

const changePlan = async (planId) => {
  if (!authStore.userId) {
    return
  }

  savingPlan.value = true

  try {
    const plan = await updateUserPlan(authStore.userId, planId)
    feedbackMessage.value = `${plan.name} plan activated.`
    await loadBilling()
  } finally {
    savingPlan.value = false
  }
}

const buyCredits = async (packageId) => {
  if (!authStore.userId) {
    return
  }

  buyingPackageId.value = packageId

  try {
    const creditPack = await purchaseCredits(authStore.userId, packageId)
    feedbackMessage.value = `${creditPack.credits} credits added to your workspace.`
    await loadBilling()
  } finally {
    buyingPackageId.value = ''
  }
}

const formatDate = (value) => {
  if (!value?.toDate) {
    return 'Recently'
  }

  return value.toDate().toLocaleDateString()
}

onMounted(loadBilling)
</script>

<style scoped lang="scss">
.billing-page,
.billing-grid,
.plan-grid,
.credit-grid,
.history-grid {
  display: grid;
  gap: 1rem;
}

.hero,
.panel {
  padding: 1.5rem;
}

.summary-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.summary-chip {
  min-width: 180px;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line);
}

.summary-chip span,
.credit-card p,
.feature-list,
.feedback {
  color: var(--muted);
}

.billing-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.plan-grid,
.credit-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.plan-card,
.credit-card {
  padding: 1.25rem;
}

.plan-name {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.74rem;
  color: var(--brand);
  font-weight: 800;
}

.plan-card h3,
.credit-card span {
  margin: 0.4rem 0 1rem;
  display: block;
}

.feature-list {
  padding-left: 1rem;
  min-height: 7rem;
}

.compact-header {
  margin-bottom: 1rem;
}

@media (max-width: 1080px) {
  .billing-grid,
  .plan-grid,
  .credit-grid {
    grid-template-columns: 1fr;
  }
}
</style>
