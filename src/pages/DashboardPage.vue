<template>
  <section>
    <div class="hero card">
      <div class="page-header">
        <h2>Welcome to Kevex ProBuild Suite</h2>
        <p>
          {{
            businessName
              ? `${businessName} is ready to generate faster estimates, track job costs, and protect margin.`
              : 'Generate faster estimates, track real job costs, and stop losing profit.'
          }}
        </p>
      </div>

      <div class="actions-row">
        <RouterLink class="btn btn--primary" to="/app/estimator">Create Estimate</RouterLink>
        <RouterLink class="btn btn--outline" to="/app/jobs">Manage Jobs</RouterLink>
      </div>
    </div>

    <div class="stats-grid">
      <StatCard v-for="stat in stats" :key="stat.label" :label="stat.label" :value="stat.value" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatCard from '@/components/StatCard.vue'
import { useCurrency } from '@/composables/useCurrency'
import { useAuthStore } from '@/stores/authStore'
import { getUserClientCount } from '@/services/clientService'
import { getUserJobSummary } from '@/services/jobService'
import { getUserQuoteCount } from '@/services/quoteService'
import { getUserProfile } from '@/services/userProfileService'

const authStore = useAuthStore()
const { formatCurrency } = useCurrency()
const quoteCount = ref(0)
const clientCount = ref(0)
const trackedProfit = ref(0)
const businessName = ref('')

const stats = computed(() => [
  { label: 'Quotes', value: String(quoteCount.value) },
  { label: 'Clients', value: String(clientCount.value) },
  { label: 'Tracked Profit', value: formatCurrency(trackedProfit.value) }
])

const loadStats = async () => {
  if (!authStore.userId) {
    return
  }

  try {
    const [quotes, clients, jobSummary] = await Promise.all([
      getUserQuoteCount(authStore.userId),
      getUserClientCount(authStore.userId),
      getUserJobSummary(authStore.userId)
    ])

    quoteCount.value = quotes
    clientCount.value = clients
    trackedProfit.value = jobSummary.totalProfit

    const profile = await getUserProfile(authStore.userId)
    businessName.value = profile?.businessName ?? ''
  } catch (error) {
    console.error('Failed to load dashboard stats', error)
  }
}

onMounted(loadStats)
</script>

<style scoped lang="scss">
.hero {
  padding: 1.6rem;
  margin-bottom: 1.5rem;
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.18), transparent 30%),
    linear-gradient(135deg, #1d4ed8, #0f766e);
  color: white;
}

.hero .page-header p {
  color: rgba(255, 255, 255, 0.82);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 840px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
