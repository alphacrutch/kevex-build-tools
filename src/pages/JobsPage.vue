<template>
  <section class="panel card">
    <div class="page-header">
      <h2>Job Profit Tracker</h2>
      <p>Track quoted value, expenses, payments, and real profit.</p>
    </div>

    <div v-if="!authStore.userId" class="empty-state">Sign in to manage jobs.</div>
    <div v-else-if="loading" class="empty-state">Loading jobs...</div>
    <div v-else-if="!jobs.length" class="empty-state">No jobs yet. Convert a quote into a job first.</div>
    <div v-else class="job-grid">
      <article v-for="job in jobs" :key="job.id" class="job-card card">
        <div class="job-head">
          <div>
            <h3>{{ job.clientName || 'Unnamed Client' }}</h3>
            <p>{{ job.serviceName }} · {{ job.status }}</p>
          </div>
          <strong>{{ formatCurrency(Number(jobDrafts[job.id]?.profit || 0)) }}</strong>
        </div>

        <div class="two-col-grid">
          <BaseInput v-model="jobDrafts[job.id].quotedTotal" label="Quoted Total" type="number" min="0" step="any" />
          <BaseInput
            v-model="jobDrafts[job.id].actualExpenses"
            label="Expenses"
            type="number"
            min="0"
            step="any"
          />
          <BaseInput
            v-model="jobDrafts[job.id].amountReceived"
            label="Payments Received"
            type="number"
            min="0"
            step="any"
          />
        </div>

        <div class="actions-row job-actions">
          <span>Calculated Profit: <strong>{{ formatCurrency(calculateProfit(jobDrafts[job.id])) }}</strong></span>
          <BaseButton @click="saveJob(job.id)">Save</BaseButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { db } from '@/boot/firebase'
import { useCurrency } from '@/composables/useCurrency'
import { getUserJobs } from '@/services/jobService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { formatCurrency } = useCurrency()
const jobs = ref([])
const loading = ref(false)
const jobDrafts = reactive({})

const calculateProfit = (job) => Number(job?.amountReceived || 0) - Number(job?.actualExpenses || 0)

const hydrateDrafts = () => {
  jobs.value.forEach((job) => {
    jobDrafts[job.id] = {
      quotedTotal: Number(job.quotedTotal || 0),
      actualExpenses: Number(job.actualExpenses || 0),
      amountReceived: Number(job.amountReceived || 0),
      profit: Number(job.profit || 0)
    }
  })
}

const loadJobs = async () => {
  if (!authStore.userId) {
    return
  }

  loading.value = true

  try {
    jobs.value = await getUserJobs(authStore.userId)
    hydrateDrafts()
  } catch (error) {
    console.error('Failed to load jobs', error)
  } finally {
    loading.value = false
  }
}

const saveJob = async (jobId) => {
  try {
    const draft = jobDrafts[jobId]
    const profit = calculateProfit(draft)

    await updateDoc(doc(db, 'jobs', jobId), {
      quotedTotal: Number(draft.quotedTotal || 0),
      actualExpenses: Number(draft.actualExpenses || 0),
      amountReceived: Number(draft.amountReceived || 0),
      profit
    })

    draft.profit = profit
    await loadJobs()
  } catch (error) {
    window.alert(error.message || 'Failed to update job.')
  }
}

onMounted(loadJobs)
</script>

<style scoped lang="scss">
.panel {
  padding: 1.5rem;
}

.job-grid {
  display: grid;
  gap: 1rem;
}

.job-card {
  padding: 1.25rem;
}

.job-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.job-head h3 {
  margin: 0;
}

.job-head p {
  margin: 0.35rem 0 0;
  color: var(--muted);
}

.job-actions {
  margin-top: 1rem;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 720px) {
  .job-head,
  .job-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
