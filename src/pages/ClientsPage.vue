<template>
  <section class="panel card">
    <div class="panel-head">
      <div class="page-header">
        <h2>Clients</h2>
        <p>Save client records, contact details, and re-quote jobs faster.</p>
      </div>

      <BaseButton @click="openNewClient">Add Client</BaseButton>
    </div>

    <div v-if="!authStore.userId" class="empty-state">Sign in to manage clients.</div>
    <div v-else-if="loading" class="empty-state">Loading clients...</div>
    <div v-else-if="!clients.length" class="empty-state">No clients added yet.</div>
    <div v-else class="client-grid">
      <article v-for="client in clients" :key="client.id" class="client-card card">
        <div class="client-head">
          <div>
            <h3>{{ client.name }}</h3>
            <p>{{ client.company || 'Independent client' }}</p>
            <span>{{ client.phone || 'No phone' }}</span>
            <span>{{ client.email || 'No email' }}</span>
          </div>

          <div class="client-actions">
            <BaseButton variant="outline" @click="editClient(client)">Edit</BaseButton>
            <BaseButton variant="outline" @click="startRequote(client)">Re-Quote</BaseButton>
            <BaseButton variant="outline" @click="removeClient(client.id)">Delete</BaseButton>
          </div>
        </div>

        <p class="notes">{{ client.notes || 'No notes added yet.' }}</p>
      </article>
    </div>

    <div v-if="dialogOpen" class="dialog-backdrop" @click.self="dialogOpen = false">
      <div class="dialog-card card">
        <div class="page-header">
          <h2>{{ editingClientId ? 'Edit Client' : 'Add Client' }}</h2>
        </div>

        <div class="form-grid">
          <div class="two-col-grid">
            <BaseInput v-model="clientForm.name" label="Client Name" />
            <BaseInput v-model="clientForm.company" label="Company" />
            <BaseInput v-model="clientForm.phone" label="Phone" />
            <BaseInput v-model="clientForm.whatsapp" label="WhatsApp Number" />
            <BaseInput v-model="clientForm.email" label="Email" type="email" />
            <BaseInput v-model="clientForm.address" label="Address" />
          </div>
          <BaseTextarea v-model="clientForm.notes" label="Notes" />
          <div class="actions-row">
            <BaseButton variant="outline" @click="dialogOpen = false">Cancel</BaseButton>
            <BaseButton :loading="saving" @click="saveClient">{{ editingClientId ? 'Update' : 'Save' }}</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { createClient, deleteClient, getUserClients, updateClient } from '@/services/clientService'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const clients = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogOpen = ref(false)
const editingClientId = ref('')
const clientForm = reactive({
  name: '',
  company: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  notes: ''
})

const resetClientForm = () => {
  clientForm.name = ''
  clientForm.company = ''
  clientForm.phone = ''
  clientForm.whatsapp = ''
  clientForm.email = ''
  clientForm.address = ''
  clientForm.notes = ''
  editingClientId.value = ''
}

const openNewClient = () => {
  resetClientForm()
  dialogOpen.value = true
}

const editClient = (client) => {
  editingClientId.value = client.id
  clientForm.name = client.name || ''
  clientForm.company = client.company || ''
  clientForm.phone = client.phone || ''
  clientForm.whatsapp = client.whatsapp || ''
  clientForm.email = client.email || ''
  clientForm.address = client.address || ''
  clientForm.notes = client.notes || ''
  dialogOpen.value = true
}

const loadClients = async () => {
  if (!authStore.userId) {
    return
  }

  loading.value = true

  try {
    clients.value = await getUserClients(authStore.userId)
  } finally {
    loading.value = false
  }
}

const saveClient = async () => {
  if (!authStore.userId || !clientForm.name.trim()) {
    return
  }

  saving.value = true

  try {
    const payload = {
      userId: authStore.userId,
      name: clientForm.name.trim(),
      company: clientForm.company.trim(),
      phone: clientForm.phone.trim(),
      whatsapp: clientForm.whatsapp.trim(),
      email: clientForm.email.trim(),
      address: clientForm.address.trim(),
      notes: clientForm.notes.trim()
    }

    if (editingClientId.value) {
      await updateClient(editingClientId.value, payload)
    } else {
      await createClient(payload)
    }

    dialogOpen.value = false
    resetClientForm()
    await loadClients()
  } finally {
    saving.value = false
  }
}

const removeClient = async (clientId) => {
  await deleteClient(clientId)
  await loadClients()
}

const startRequote = (client) => {
  router.push({
    path: '/app/estimator',
    query: {
      clientId: client.id
    }
  })
}

onMounted(loadClients)
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

.client-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.client-card {
  padding: 1.25rem;
}

.client-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.client-head h3,
.client-head p,
.client-head span {
  margin: 0 0 0.35rem;
}

.client-head p,
.client-head span,
.notes {
  color: var(--muted);
}

.client-actions {
  display: grid;
  gap: 0.5rem;
}

.notes {
  margin: 1rem 0 0;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 40;
}

.dialog-card {
  width: min(100%, 620px);
  padding: 1.5rem;
}

@media (max-width: 840px) {
  .client-grid {
    grid-template-columns: 1fr;
  }

  .panel-head,
  .client-head {
    flex-direction: column;
  }
}
</style>
