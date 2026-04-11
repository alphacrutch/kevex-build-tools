<template>
  <section>
    <div class="hero card">
      <div class="page-header">
        <h2>Run every client job from one place</h2>
        <p>
          {{
            businessName
              ? `${businessName} can quote faster, track cash, and send invoices without losing the profit picture.`
              : 'Generate faster estimates, track real job costs, and stop losing profit.'
          }}
        </p>
      </div>

      <div class="actions-row">
        <RouterLink class="btn btn--primary" to="/app/estimator">Create Quote</RouterLink>
        <RouterLink class="btn btn--outline" to="/app/billing">Buy Credits</RouterLink>
      </div>
    </div>

    <div class="stats-grid">
      <StatCard v-for="stat in stats" :key="stat.label" :label="stat.label" :value="stat.value" />
    </div>

    <div class="workspace-grid">
      <section class="panel card">
        <div class="page-header compact-header">
          <h2>What this workspace does</h2>
          <p>Everything lines up around the quote-to-cash flow your clients will actually use.</p>
        </div>

        <div class="summary-row"><span>Trade estimators</span><strong>Tiling, plumbing, electrical, painting, concrete</strong></div>
        <div class="summary-row"><span>Quote output</span><strong>PDF export and WhatsApp-ready share</strong></div>
        <div class="summary-row"><span>Tracking</span><strong>Clients, jobs, invoices, profit, and credits</strong></div>
      </section>

      <section class="panel card">
        <div class="page-header compact-header">
          <h2>Plan Snapshot</h2>
          <p>Keep an eye on the current plan and available credit buffer.</p>
        </div>

        <div class="summary-row"><span>Plan</span><strong>{{ activePlan.name }}</strong></div>
        <div class="summary-row"><span>Quote credits</span><strong>{{ profile?.quoteCredits || 0 }}</strong></div>
        <div class="summary-row"><span>Monthly quote usage</span><strong>{{ profile?.monthlyQuoteUsage || 0 }}</strong></div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatCard from '@/components/StatCard.vue'
import { getPlanById } from '@/config/plans'
import { useCurrency } from '@/composables/useCurrency'
import { getUserClientCount } from '@/services/clientService'
import { getUserInvoices } from '@/services/invoiceService'
import { getUserJobSummary } from '@/services/jobService'
import { getUserQuoteCount } from '@/services/quoteService'
import { getUserProfile } from '@/services/userProfileService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { formatCurrency } = useCurrency()
const quoteCount = ref(0)
const clientCount = ref(0)
const trackedProfit = ref(0)
const invoiceBalance = ref(0)
const businessName = ref('')
const profile = ref(null)

const activePlan = computed(() => getPlanById(profile.value?.planId))

const stats = computed(() => [
  { label: 'Quotes', value: String(quoteCount.value) },
  { label: 'Clients', value: String(clientCount.value) },
  { label: 'Tracked Profit', value: formatCurrency(trackedProfit.value) },
  { label: 'Invoice Balance', value: formatCurrency(invoiceBalance.value) }
])

const loadStats = async () => {
  if (!authStore.userId) {
    return
  }

  const [quotes, clients, jobSummary, profileRecord, invoices] = await Promise.all([
    getUserQuoteCount(authStore.userId),
    getUserClientCount(authStore.userId),
    getUserJobSummary(authStore.userId),
    getUserProfile(authStore.userId),
    getUserInvoices(authStore.userId)
  ])

  quoteCount.value = quotes
  clientCount.value = clients
  trackedProfit.value = jobSummary.totalProfit
  invoiceBalance.value = invoices.reduce((sum, invoice) => sum + Number(invoice.balanceDue || 0), 0)
  profile.value = profileRecord
  businessName.value = profileRecord?.businessName ?? ''
}

onMounted(loadStats)
</script>

<style scoped lang="scss">
.hero,
.panel {
  padding: 1.6rem;
}

.hero {
  margin-bottom: 1.5rem;
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.18), transparent 30%),
    linear-gradient(135deg, #1d4ed8, #0f766e);
  color: white;
}

.hero .page-header p {
  color: rgba(255, 255, 255, 0.82);
}

.stats-grid,
.workspace-grid {
  display: grid;
  gap: 1rem;
}

.stats-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 1rem;
}

.workspace-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.compact-header {
  margin-bottom: 0.75rem;
}

@media (max-width: 840px) {
  .stats-grid,
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}
</style>
