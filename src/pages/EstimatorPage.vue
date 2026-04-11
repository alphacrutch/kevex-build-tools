<template>
  <section class="estimator-page">
    <div class="workspace-grid">
      <div class="panel card">
        <div class="page-header">
          <h2>Smart Quote Builder</h2>
          <p>Build real contractor quotes with materials, labor, markup, and client-ready output.</p>
        </div>

        <div class="form-grid">
          <div class="three-col-grid">
            <BaseSelect v-model="selectedService" label="Job Type" :options="serviceOptions" />
            <BaseSelect v-model="selectedClientId" label="Saved Client" :options="clientOptions" />
            <BaseInput v-model="quoteTitle" label="Quote Title" placeholder="Kitchen wall tiling" />
          </div>

          <div class="two-col-grid">
            <BaseInput v-model="clientName" label="Client Name" placeholder="Client or business name" />
            <BaseInput v-model="templateName" label="Template Name" placeholder="Starter template name" />
            <BaseInput v-model="clientWhatsapp" label="Client WhatsApp Number" placeholder="18681234567" />
            <BaseSelect v-model="selectedTemplateId" label="Load Template" :options="templateOptions" />
          </div>

          <div class="actions-row">
            <BaseButton variant="outline" :disabled="!selectedTemplateId" @click="applyTemplate">Load Template</BaseButton>
            <BaseButton variant="outline" :disabled="!authStore.userId" @click="saveTemplate">Save Template</BaseButton>
          </div>

          <div class="two-col-grid">
            <component
              :is="field.component === 'select' ? BaseSelect : BaseInput"
              v-for="field in activeFields"
              :key="field.key"
              v-model="form[field.key]"
              :label="field.label"
              :type="field.type"
              :min="field.min"
              :step="field.step"
              :options="field.options"
            />
            <BaseInput v-model="form.overheadCost" label="Overhead / Delivery" type="number" min="0" step="any" />
            <BaseInput v-model="form.markupPercent" label="Markup (%)" type="number" min="0" step="any" />
          </div>

          <div class="actions-row">
            <BaseButton @click="runEstimate">Calculate Quote</BaseButton>
            <BaseButton
              variant="outline"
              :disabled="!estimateResult || !authStore.userId"
              :loading="saving"
              @click="saveQuote"
            >
              Save Quote
            </BaseButton>
          </div>

          <p v-if="billingMessage" class="helper-text">{{ billingMessage }}</p>
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        </div>
      </div>

      <div class="side-stack">
        <div class="panel card result-card">
          <div class="page-header">
            <h2>Quote Summary</h2>
            <p>Total cost, materials, labor estimate, and profit margin in one view.</p>
          </div>

          <template v-if="estimateResult">
            <div class="summary-head">
              <strong>{{ quoteTitle || `${estimateResult.service} Quote` }}</strong>
              <p>{{ clientName || 'Client not provided' }}</p>
            </div>

            <div class="stat-pills">
              <span class="pill">{{ estimateResult.service }}</span>
              <span class="pill">{{ estimateResult.materialType }}</span>
              <span class="pill">{{ estimateResult.profitMargin }}% margin</span>
            </div>

            <h3 class="section-title">Metrics</h3>
            <div v-for="(value, key) in estimateResult.metrics" :key="key" class="metric-row">
              <span>{{ prettify(key) }}</span>
              <strong>{{ value }}</strong>
            </div>

            <h3 class="section-title">Materials</h3>
            <div v-for="item in estimateResult.materials" :key="item.label" class="metric-row">
              <span>{{ item.label }}</span>
              <strong>{{ item.quantity }} {{ item.unit }} | {{ formatCurrency(item.total) }}</strong>
            </div>

            <h3 class="section-title">Labor</h3>
            <div class="metric-row">
              <span>Estimated labor</span>
              <strong>{{ estimateResult.labor.hours }} hrs / {{ estimateResult.labor.days }} days</strong>
            </div>
            <div class="metric-row">
              <span>Labor cost</span>
              <strong>{{ formatCurrency(estimateResult.labor.total) }}</strong>
            </div>

            <h3 class="section-title">Pricing</h3>
            <div v-for="(value, key) in estimateResult.costs" :key="key" class="summary-row">
              <span>{{ prettify(key) }}</span>
              <strong>{{ formatCurrency(value) }}</strong>
            </div>
          </template>

          <p v-else class="empty-state">Run an estimate to generate materials, labor, and total pricing.</p>
        </div>

        <div class="panel card">
          <div class="page-header compact-header">
            <h2>Usage</h2>
            <p>Track plan access and available quote credits.</p>
          </div>

          <div class="summary-row">
            <span>Plan</span>
            <strong>{{ allowance?.plan?.name || 'Starter' }}</strong>
          </div>
          <div class="summary-row">
            <span>Included quotes left</span>
            <strong>{{ includedQuotesLabel }}</strong>
          </div>
          <div class="summary-row">
            <span>Purchased credits</span>
            <strong>{{ allowance?.quoteCredits ?? 0 }}</strong>
          </div>
          <RouterLink class="btn btn--outline" to="/app/billing">Manage Billing & Credits</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import services from '@/config/serviceConfig'
import { useCurrency } from '@/composables/useCurrency'
import { useEstimator } from '@/composables/useEstimator'
import { consumeQuoteEntitlement, getQuoteAllowance } from '@/services/billingService'
import { getUserClients } from '@/services/clientService'
import { createQuote } from '@/services/quoteService'
import { createQuoteTemplate, getUserQuoteTemplates } from '@/services/templateService'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const { calculateEstimate } = useEstimator()
const { formatCurrency } = useCurrency()
const authStore = useAuthStore()

const serviceOptions = Object.values(services).map((service) => ({
  value: service.id,
  label: service.title
}))

const selectedService = ref('tiling')
const selectedClientId = ref('')
const selectedTemplateId = ref('')
const quoteTitle = ref('')
const clientName = ref('')
const clientWhatsapp = ref('')
const templateName = ref('')
const form = ref({})
const estimateResult = ref(null)
const clients = ref([])
const templates = ref([])
const allowance = ref(null)
const billingMessage = ref('')
const errorMessage = ref('')
const saving = ref(false)

const clientOptions = computed(() => [
  { value: '', label: 'No saved client selected' },
  ...clients.value.map((client) => ({ value: client.id, label: client.name }))
])

const templateOptions = computed(() => [
  { value: '', label: 'Choose a saved template' },
  ...templates.value.map((template) => ({ value: template.id, label: template.name }))
])

const activeFields = computed(() => services[selectedService.value]?.fields ?? [])

const includedQuotesLabel = computed(() =>
  allowance.value?.includedQuotesRemaining == null ? 'Unlimited' : String(allowance.value.includedQuotesRemaining)
)

const resetForm = () => {
  const service = services[selectedService.value]
  const nextForm = {
    markupPercent: 20,
    overheadCost: 0,
    wastePercent: service.defaultWaste
  }

  service.fields.forEach((field) => {
    nextForm[field.key] = service.initialValues?.[field.key] ?? ''
  })

  form.value = nextForm
  estimateResult.value = null
}

const syncSelectedClient = () => {
  const selectedClient = clients.value.find((client) => client.id === selectedClientId.value)

  if (!selectedClient) {
    return
  }

  clientName.value = selectedClient.name || ''
  clientWhatsapp.value = (selectedClient.whatsapp || selectedClient.phone || '').replace(/\D/g, '')
}

const loadWorkspace = async () => {
  if (!authStore.userId) {
    return
  }

  const [clientRecords, templateRecords, quoteAllowance] = await Promise.all([
    getUserClients(authStore.userId),
    getUserQuoteTemplates(authStore.userId),
    getQuoteAllowance(authStore.userId)
  ])

  clients.value = clientRecords
  templates.value = templateRecords
  allowance.value = quoteAllowance
  syncSelectedClient()
}

const applyQueryDefaults = () => {
  if (route.query.serviceId && services[route.query.serviceId]) {
    selectedService.value = route.query.serviceId
  }

  if (route.query.clientId) {
    selectedClientId.value = String(route.query.clientId)
  }
}

watch(selectedService, resetForm, { immediate: true })
watch(selectedClientId, syncSelectedClient)

const runEstimate = () => {
  errorMessage.value = ''
  estimateResult.value = calculateEstimate(selectedService.value, form.value)
}

const applyTemplate = () => {
  const template = templates.value.find((item) => item.id === selectedTemplateId.value)

  if (!template) {
    return
  }

  selectedService.value = template.serviceId
  quoteTitle.value = template.quoteTitle || ''
  form.value = { ...template.form }
}

const saveTemplate = async () => {
  if (!authStore.userId || !templateName.value.trim()) {
    errorMessage.value = 'Add a template name before saving.'
    return
  }

  await createQuoteTemplate({
    userId: authStore.userId,
    name: templateName.value.trim(),
    serviceId: selectedService.value,
    quoteTitle: quoteTitle.value.trim(),
    form: { ...form.value }
  })

  templateName.value = ''
  await loadWorkspace()
}

const saveQuote = async () => {
  if (!authStore.userId || !estimateResult.value) {
    return
  }

  saving.value = true
  errorMessage.value = ''

  try {
    const entitlement = await consumeQuoteEntitlement(authStore.userId)

    await createQuote({
      userId: authStore.userId,
      clientId: selectedClientId.value || null,
      clientName: clientName.value.trim(),
      clientWhatsapp: clientWhatsapp.value.trim(),
      title: quoteTitle.value.trim() || `${estimateResult.value.service} Quote`,
      serviceId: selectedService.value,
      serviceName: services[selectedService.value]?.title,
      form: { ...form.value },
      result: estimateResult.value,
      status: 'draft'
    })

    billingMessage.value =
      entitlement.source === 'credit'
        ? `Quote saved. 1 purchased credit used. ${entitlement.remainingCredits} credits remaining.`
        : 'Quote saved successfully.'

    await loadWorkspace()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to save quote.'
  } finally {
    saving.value = false
  }
}

const prettify = (value) =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())

onMounted(async () => {
  applyQueryDefaults()
  await loadWorkspace()
})
</script>

<style scoped lang="scss">
.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
  gap: 1rem;
}

.panel {
  padding: 1.5rem;
}

.side-stack {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.result-card {
  position: sticky;
  top: 6rem;
}

.three-col-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-head {
  margin-bottom: 0.75rem;
}

.summary-head p {
  margin: 0.35rem 0 0;
  color: var(--muted);
}

.stat-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.pill {
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(29, 78, 216, 0.08);
  color: var(--brand);
  font-size: 0.88rem;
  font-weight: 700;
}

.section-title {
  margin: 1.25rem 0 0.6rem;
  font-size: 1rem;
}

.compact-header {
  margin-bottom: 0.75rem;
}

@media (max-width: 1080px) {
  .workspace-grid,
  .three-col-grid {
    grid-template-columns: 1fr;
  }

  .result-card {
    position: static;
  }
}
</style>
