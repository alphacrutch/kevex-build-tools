<template>
  <section class="panel card">
    <div class="panel-head">
      <div class="page-header">
        <h2>Invoices</h2>
        <p>Track balances due, record payments, and export client-ready invoices.</p>
      </div>

      <BaseButton variant="outline" :loading="loading" @click="loadInvoices">Refresh</BaseButton>
    </div>

    <div v-if="!authStore.userId" class="empty-state">Sign in to manage invoices.</div>
    <div v-else-if="loading" class="empty-state">Loading invoices...</div>
    <div v-else-if="!invoices.length" class="empty-state">No invoices created yet.</div>
    <div v-else class="invoice-grid">
      <article v-for="invoice in invoices" :key="invoice.id" class="invoice-card card">
        <div class="invoice-head">
          <div>
            <h3>{{ invoice.invoiceTitle || invoice.clientName }}</h3>
            <p>{{ invoice.invoiceNumber }} | {{ invoice.status }}</p>
            <span>{{ invoice.clientName }} | Due {{ formatDate(invoice.dueDate) }}</span>
          </div>
          <strong>{{ formatCurrency(invoice.balanceDue) }}</strong>
        </div>

        <div class="summary-row">
          <span>Total</span>
          <strong>{{ formatCurrency(invoice.amount) }}</strong>
        </div>
        <div class="summary-row">
          <span>Paid</span>
          <strong>{{ formatCurrency(invoice.amountPaid) }}</strong>
        </div>
        <div class="summary-row">
          <span>Balance</span>
          <strong>{{ formatCurrency(invoice.balanceDue) }}</strong>
        </div>

        <div class="two-col-grid">
          <BaseInput v-model="paymentDrafts[invoice.id]" label="Record Payment" type="number" min="0" step="any" />
          <BaseSelect v-model="statusDrafts[invoice.id]" label="Status" :options="statusOptions" />
        </div>

        <div class="actions-row">
          <BaseButton variant="outline" @click="downloadPdf(invoice)">PDF</BaseButton>
          <BaseButton variant="outline" @click="saveStatus(invoice)">Update Status</BaseButton>
          <BaseButton variant="outline" @click="recordPayment(invoice)">Apply Payment</BaseButton>
          <BaseButton variant="outline" @click="removeInvoice(invoice.id)">Delete</BaseButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { useCurrency } from '@/composables/useCurrency'
import { deleteInvoice, getUserInvoices, recordInvoicePayment, updateInvoice } from '@/services/invoiceService'
import { useAuthStore } from '@/stores/authStore'
import { exportInvoicePdf } from '@/utils/pdfInvoice'

const authStore = useAuthStore()
const { formatCurrency } = useCurrency()
const invoices = ref([])
const loading = ref(false)
const paymentDrafts = reactive({})
const statusDrafts = reactive({})

const statusOptions = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' }
]

const loadInvoices = async () => {
  if (!authStore.userId) {
    return
  }

  loading.value = true

  try {
    invoices.value = await getUserInvoices(authStore.userId)
    invoices.value.forEach((invoice) => {
      paymentDrafts[invoice.id] = ''
      statusDrafts[invoice.id] = invoice.status || 'unpaid'
    })
  } finally {
    loading.value = false
  }
}

const saveStatus = async (invoice) => {
  await updateInvoice(invoice.id, { status: statusDrafts[invoice.id] })
  await loadInvoices()
}

const recordPayment = async (invoice) => {
  await recordInvoicePayment(invoice.id, invoice, Number(paymentDrafts[invoice.id] || 0))
  paymentDrafts[invoice.id] = ''
  await loadInvoices()
}

const removeInvoice = async (invoiceId) => {
  await deleteInvoice(invoiceId)
  await loadInvoices()
}

const downloadPdf = (invoice) => {
  exportInvoicePdf(invoice)
}

const formatDate = (value) => new Date(value).toLocaleDateString()

onMounted(loadInvoices)
</script>

<style scoped lang="scss">
.panel {
  padding: 1.5rem;
}

.panel-head,
.invoice-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.panel-head {
  margin-bottom: 1rem;
}

.invoice-grid {
  display: grid;
  gap: 1rem;
}

.invoice-card {
  padding: 1.25rem;
}

.invoice-head h3 {
  margin: 0;
}

.invoice-head p,
.invoice-head span {
  margin: 0.35rem 0 0;
  color: var(--muted);
}

@media (max-width: 720px) {
  .panel-head,
  .invoice-head {
    flex-direction: column;
  }
}
</style>
