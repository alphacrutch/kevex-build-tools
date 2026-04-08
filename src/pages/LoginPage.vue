<template>
  <section class="auth-page">
    <div class="auth-layout">
      <aside class="auth-side card">
        <p class="auth-side__eyebrow">Client workspace</p>
        <h1>Pick up where your last quote, client, or job left off.</h1>
        <p>
          Sign in to access the full Kevex workspace, including saved estimates, client records, and project
          tracking.
        </p>
      </aside>

      <div class="auth-card card">
        <div class="auth-head">
          <h2>Welcome Back</h2>
          <p>Sign in to access Kevex Build Tools.</p>
        </div>

        <form class="form-grid" @submit.prevent="handleLogin">
          <BaseInput v-model="email" label="Email" type="email" placeholder="name@company.com" />
          <BaseInput v-model="password" label="Password" type="password" placeholder="Enter password" />
          <BaseButton type="submit" :loading="authStore.loading" full-width>
            {{ authStore.loading ? 'Signing In...' : 'Sign In' }}
          </BaseButton>
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        </form>

        <div class="auth-links">
          <RouterLink to="/">Back to landing page</RouterLink>
          <RouterLink to="/register">Create an account</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useAuthStore } from '@/stores/authStore'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

authStore.init()

const handleLogin = async () => {
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/app/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Login failed.'
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  padding: 1.5rem;
  background:
    radial-gradient(circle at top, rgba(31, 111, 120, 0.18), transparent 32%),
    linear-gradient(180deg, #f4f7f7 0%, #f8fbff 70%);
}

.auth-layout {
  width: min(1080px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  min-height: calc(100vh - 3rem);
}

.auth-side,
.auth-card {
  padding: 2rem;
}

.auth-side {
  background:
    linear-gradient(180deg, rgba(19, 78, 74, 0.96), rgba(15, 23, 42, 0.96)),
    #112030;
  color: white;
}

.auth-side h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1;
}

.auth-side__eyebrow {
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.72);
}

.auth-head h2 {
  margin: 0 0 0.5rem;
}

.auth-head p {
  margin: 0 0 1.5rem;
  color: var(--muted);
}

.auth-links {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}

.auth-links a {
  color: var(--brand);
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 920px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
}
</style>
