<template>
  <section class="estimator-layout">
    <div class="panel card">
      <div class="page-header">
        <h2>Smart Estimator</h2>
        <p>Create quick estimates for real jobs.</p>
      </div>

      <div class="form-grid">
        <BaseSelect v-model="selectedService" label="Select Service" :options="serviceOptions" />

        <div class="two-col-grid">
          <BaseInput
            v-for="field in activeFields"
            :key="field.key"
            v-model="form[field.key]"
            :label="field.label"
            :type="field.type"
            :min="field.min"
            :step="field.step"
          />
          <BaseInput v-model="form.markupPercent" label="Markup (%)" type="number" min="0" step="any" />
          <BaseInput v-model="clientName" label="Client Name" placeholder="Optional client name" />
        </div>

        <div class="actions-row">
          <BaseButton @click="runEstimate">Calculate Estimate</BaseButton>
          <BaseButton
            variant="outline"
            :disabled="!estimateResult || !authStore.userId"
            :loading="saving"
            @click="saveQuote"
          >
            Save Quote
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="panel card result-card">
      <div class="page-header">
        <h2>Estimate Summary</h2>
      </div>

      <template v-if="estimateResult">
        <div class="summary-head">
          <strong>{{ estimateResult.service }}</strong>
          <p>{{ clientName || 'Client not provided' }}</p>
        </div>

        <div v-for="(value, key) in estimateResult.metrics" :key="key" class="metric-row">
          <span>{{ prettify(key) }}</span>
          <strong>{{ value }}</strong>
        </div>

        <div class="separator" />

        <div v-for="(value, key) in estimateResult.costs" :key="key" class="summary-row">
          <span>{{ prettify(key) }}</span>
          <strong>{{ isMoneyKey(key) ? formatCurrency(value) : value }}</strong>
        </div>
      </template>

      <p v-else class="empty-state">Run an estimate to see totals here.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import services from '@/config/serviceConfig'
import { useCurrency } from '@/composables/useCurrency'
import { useEstimator } from '@/composables/useEstimator'
import { createQuote } from '@/services/quoteService'
import { useAuthStore } from '@/stores/authStore'

const { calculateEstimate } = useEstimator()
const { formatCurrency } = useCurrency()
const authStore = useAuthStore()

const serviceOptions = Object.values(services).map((service) => ({
  value: service.id,
  label: service.title
}))

const selectedService = ref('tiling')
const form = ref({})
const clientName = ref('')
const estimateResult = ref(null)
const saving = ref(false)

const activeFields = computed(() => services[selectedService.value]?.fields ?? [])

const resetForm = () => {
  const service = services[selectedService.value]
  const nextForm = { markupPercent: 20 }

  service.fields.forEach((field) => {
    nextForm[field.key] = field.key === 'wastePercent' ? service.defaultWaste : ''
  })

  form.value = nextForm
  estimateResult.value = null
}

watch(selectedService, resetForm, { immediate: true })

const runEstimate = () => {
  estimateResult.value = calculateEstimate(selectedService.value, form.value)
}

const saveQuote = async () => {
  if (!authStore.userId || !estimateResult.value) {
    return
  }

  saving.value = true

  try {
    await createQuote({
      userId: authStore.userId,
      clientName: clientName.value.trim(),
      serviceId: selectedService.value,
      serviceName: services[selectedService.value]?.title,
      form: { ...form.value },
      result: estimateResult.value,
      status: 'draft'
    })

    window.alert('Quote saved successfully.')
  } catch (error) {
    window.alert(error.message || 'Failed to save quote.')
  } finally {
    saving.value = false
  }
}

const prettify = (value) =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())

const isMoneyKey = (key) => key.toLowerCase().includes('cost') || ['markupValue', 'total'].includes(key)
</script>

<style scoped lang="scss">
.estimator-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
  gap: 1rem;
}

.panel {
  padding: 1.5rem;
}

.result-card {
  position: sticky;
  top: 6rem;
  height: fit-content;
}

.summary-head {
  margin-bottom: 0.75rem;
}

.summary-head p {
  margin: 0.35rem 0 0;
  color: var(--muted);
}

.separator {
  height: 1px;
  background: rgba(148, 163, 184, 0.22);
  margin: 1rem 0;
}

@media (max-width: 1080px) {
  .estimator-layout {
    grid-template-columns: 1fr;
  }

  .result-card {
    position: static;
  }
}
</style>
