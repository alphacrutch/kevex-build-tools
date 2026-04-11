<template>
  <section class="panel card">
    <div class="panel-head">
      <div class="page-header">
        <h2>Quotes</h2>
        <p>Manage saved quotes, share them to WhatsApp, and turn them into jobs or invoices.</p>
      </div>

      <BaseButton variant="outline" :loading="loading" @click="loadQuotes">Refresh</BaseButton>
    </div>

    <div v-if="!authStore.userId" class="empty-state">Sign in to load saved quotes.</div>
    <div v-else-if="loading" class="empty-state">Loading quotes...</div>
    <div v-else-if="!quotes.length" class="empty-state">No saved quotes yet.</div>
    <div v-else class="list-grid">
      <article v-for="quote in quotes" :key="quote.id" class="quote-card card">
        <div class="quote-header">
          <div>
            <h3>{{ quote.title || quote.clientName || 'Unnamed Quote' }}</h3>
            <p>{{ quote.quoteNumber }} | {{ quote.serviceName }} | {{ quote.status || 'draft' }}</p>
            <span>{{ quote.clientName || 'No client selected' }}</span>
          </div>
          <strong>{{ formatCurrency(quote.result?.costs?.total) }}</strong>
        </div>

        <div class="quote-meta">
          <span>Margin: {{ quote.result?.profitMargin || 0 }}%</span>
          <span>Materials: {{ quote.result?.materials?.length || 0 }}</span>
          <span>Labor: {{ quote.result?.labor?.hours || 0 }} hrs</span>
        </div>

        <div class="actions-row">
          <BaseButton variant="outline" @click="downloadPdf(quote)">PDF</BaseButton>
          <BaseButton variant="outline" @click="shareWhatsapp(quote)">WhatsApp</BaseButton>
          <BaseButton variant="outline" @click="convertToJob(quote)">To Job</BaseButton>
          <BaseButton variant="outline" @click="createInvoiceRecord(quote)">Invoice</BaseButton>
          <BaseButton variant="outline" @click="removeQuote(quote.id)">Delete</BaseButton>
        </div>
      </article>
    </div>

    <p v-if="feedbackMessage" class="helper-text feedback">{{ feedbackMessage }}</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useCurrency } from '@/composables/useCurrency'
import { createInvoiceFromQuote } from '@/services/invoiceService'
import { createJobFromQuote } from '@/services/jobService'
import { deleteQuote, getUserQuotes, updateQuoteStatus } from '@/services/quoteService'
import { useAuthStore } from '@/stores/authStore'
import { exportQuotePdf } from '@/utils/pdfQuote'

const authStore = useAuthStore()
const { formatCurrency } = useCurrency()
const quotes = ref([])
const loading = ref(false)
const feedbackMessage = ref('')

const loadQuotes = async () => {
  if (!authStore.userId) {
    return
  }

  loading.value = true

  try {
    quotes.value = await getUserQuotes(authStore.userId)
  } catch (error) {
    feedbackMessage.value = error.message || 'Failed to load quotes.'
  } finally {
    loading.value = false
  }
}

const downloadPdf = (quote) => {
  exportQuotePdf(quote)
}

const shareWhatsapp = (quote) => {
  const phone = (quote.clientWhatsapp || '').replace(/\D/g, '')
  const message = [
    `Hello ${quote.clientName || 'Client'},`,
    `Your ${quote.serviceName || 'job'} quote is ready.`,
    `${quote.quoteNumber || 'Quote'} total: ${formatCurrency(quote.result?.costs?.total)}`,
    `Materials: ${quote.result?.materials?.map((item) => `${item.label} ${item.quantity} ${item.unit}`).join(', ') || 'Included'}`
  ].join(' ')
  const target = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(target, '_blank', 'noopener,noreferrer')
}

const convertToJob = async (quote) => {
  try {
    await createJobFromQuote(quote)
    await updateQuoteStatus(quote.id, 'converted')
    feedbackMessage.value = 'Quote converted to job.'
    await loadQuotes()
  } catch (error) {
    feedbackMessage.value = error.message || 'Failed to convert quote.'
  }
}

const createInvoiceRecord = async (quote) => {
  try {
    await createInvoiceFromQuote(quote)
    await updateQuoteStatus(quote.id, 'invoiced')
    feedbackMessage.value = 'Invoice created from quote.'
    await loadQuotes()
  } catch (error) {
    feedbackMessage.value = error.message || 'Failed to create invoice.'
  }
}

const removeQuote = async (quoteId) => {
  try {
    await deleteQuote(quoteId)
    feedbackMessage.value = 'Quote deleted.'
    await loadQuotes()
  } catch (error) {
    feedbackMessage.value = error.message || 'Failed to delete quote.'
  }
}

onMounted(loadQuotes)
</script>

<style scoped lang="scss">
.panel {
  padding: 1.5rem;
}

.panel-head,
.quote-header,
.quote-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.panel-head {
  margin-bottom: 1rem;
}

.list-grid {
  display: grid;
  gap: 1rem;
}

.quote-card {
  padding: 1.25rem;
}

.quote-header h3 {
  margin: 0;
}

.quote-header p,
.quote-header span,
.quote-meta {
  color: var(--muted);
}

.quote-meta {
  margin: 1rem 0;
  flex-wrap: wrap;
}

.feedback {
  margin-top: 1rem;
}

@media (max-width: 720px) {
  .panel-head,
  .quote-header,
  .quote-meta {
    flex-direction: column;
  }
}
</style>
