<template>
  <section class="panel card">
    <div class="panel-head">
      <div class="page-header">
        <h2>Quotes</h2>
        <p>Saved quotes for the signed-in contractor.</p>
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
            <h3>{{ quote.clientName || 'Unnamed Client' }}</h3>
            <p>{{ quote.serviceName }} · {{ quote.status || 'draft' }}</p>
          </div>
          <strong>{{ formatCurrency(quote.result?.costs?.total) }}</strong>
        </div>

        <div class="actions-row">
          <BaseButton variant="outline" @click="downloadPdf(quote)">PDF</BaseButton>
          <BaseButton variant="outline" @click="convertToJob(quote)">To Job</BaseButton>
          <BaseButton variant="outline" @click="removeQuote(quote.id)">Delete</BaseButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useCurrency } from '@/composables/useCurrency'
import { createJobFromQuote } from '@/services/jobService'
import { deleteQuote, getUserQuotes, updateQuoteStatus } from '@/services/quoteService'
import { useAuthStore } from '@/stores/authStore'
import { exportQuotePdf } from '@/utils/pdfQuote'

const authStore = useAuthStore()
const { formatCurrency } = useCurrency()
const quotes = ref([])
const loading = ref(false)

const loadQuotes = async () => {
  if (!authStore.userId) {
    return
  }

  loading.value = true

  try {
    quotes.value = await getUserQuotes(authStore.userId)
  } catch (error) {
    console.error('Failed to load quotes', error)
  } finally {
    loading.value = false
  }
}

const downloadPdf = (quote) => {
  exportQuotePdf(quote)
}

const convertToJob = async (quote) => {
  try {
    await createJobFromQuote(quote)
    await updateQuoteStatus(quote.id, 'converted')
    window.alert('Quote converted to job.')
    await loadQuotes()
  } catch (error) {
    window.alert(error.message || 'Failed to convert quote.')
  }
}

const removeQuote = async (quoteId) => {
  try {
    await deleteQuote(quoteId)
    await loadQuotes()
  } catch (error) {
    window.alert(error.message || 'Failed to delete quote.')
  }
}

onMounted(loadQuotes)
</script>

<style scoped lang="scss">
.panel {
  padding: 1.5rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.list-grid {
  display: grid;
  gap: 1rem;
}

.quote-card {
  padding: 1.25rem;
}

.quote-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.quote-header h3 {
  margin: 0;
}

.quote-header p {
  margin: 0.4rem 0 0;
  color: var(--muted);
}

@media (max-width: 720px) {
  .panel-head,
  .quote-header {
    flex-direction: column;
  }
}
</style>
