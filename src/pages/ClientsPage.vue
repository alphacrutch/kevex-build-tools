<template>
  <section class="panel card">
    <div class="panel-head">
      <div class="page-header">
        <h2>Clients</h2>
        <p>Store clients for faster future quoting.</p>
      </div>

      <BaseButton @click="dialogOpen = true">Add Client</BaseButton>
    </div>

    <div v-if="!authStore.userId" class="empty-state">Sign in to manage clients.</div>
    <div v-else-if="loading" class="empty-state">Loading clients...</div>
    <div v-else-if="!clients.length" class="empty-state">No clients added yet.</div>
    <div v-else class="client-grid">
      <article v-for="client in clients" :key="client.id" class="client-card card">
        <div class="client-head">
          <div>
            <h3>{{ client.name }}</h3>
            <p>{{ client.phone || 'No phone' }}</p>
            <span>{{ client.email || 'No email' }}</span>
          </div>

          <BaseButton variant="outline" @click="removeClient(client.id)">Delete</BaseButton>
        </div>
      </article>
    </div>

    <div v-if="dialogOpen" class="dialog-backdrop" @click.self="dialogOpen = false">
      <div class="dialog-card card">
        <div class="page-header">
          <h2>Add Client</h2>
        </div>

        <div class="form-grid">
          <BaseInput v-model="clientForm.name" label="Client Name" />
          <BaseInput v-model="clientForm.phone" label="Phone" />
          <BaseInput v-model="clientForm.email" label="Email" type="email" />
          <BaseTextarea v-model="clientForm.notes" label="Notes" />
          <div class="actions-row">
            <BaseButton variant="outline" @click="dialogOpen = false">Cancel</BaseButton>
            <BaseButton :loading="saving" @click="saveClient">Save</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { createClient, deleteClient, getUserClients } from '@/services/clientService'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const clients = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogOpen = ref(false)
const clientForm = reactive({
  name: '',
  phone: '',
  email: '',
  notes: ''
})

const resetClientForm = () => {
  clientForm.name = ''
  clientForm.phone = ''
  clientForm.email = ''
  clientForm.notes = ''
}

const loadClients = async () => {
  if (!authStore.userId) {
    return
  }

  loading.value = true

  try {
    clients.value = await getUserClients(authStore.userId)
  } catch (error) {
    console.error('Failed to load clients', error)
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
    await createClient({
      userId: authStore.userId,
      name: clientForm.name.trim(),
      phone: clientForm.phone.trim(),
      email: clientForm.email.trim(),
      notes: clientForm.notes.trim()
    })

    dialogOpen.value = false
    resetClientForm()
    await loadClients()
  } catch (error) {
    console.error('Failed to save client', error)
  } finally {
    saving.value = false
  }
}

const removeClient = async (clientId) => {
  try {
    await deleteClient(clientId)
    await loadClients()
  } catch (error) {
    window.alert(error.message || 'Failed to delete client.')
  }
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

.client-head h3 {
  margin: 0;
}

.client-head p,
.client-head span {
  display: block;
  margin: 0.35rem 0 0;
  color: var(--muted);
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
  width: min(100%, 520px);
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
