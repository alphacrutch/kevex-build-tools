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
          <button class="social-btn" type="button" :disabled="authStore.loading" @click="handleGoogleLogin">
            <span class="social-btn__mark">G</span>
            <span>Continue with Google</span>
          </button>
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
import { ensureUserProfile } from '@/services/userProfileService'

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

const handleGoogleLogin = async () => {
  errorMessage.value = ''

  try {
    const { user } = await authStore.loginWithGoogle()

    await ensureUserProfile(user.uid, {
      ownerFirstName: user.displayName?.split(' ')[0] ?? '',
      ownerLastName: user.displayName?.split(' ').slice(1).join(' ') ?? '',
      ownerFullName: user.displayName ?? '',
      email: user.email ?? '',
      phone: user.phoneNumber ?? '',
      businessName: '',
      operatingRegion: '',
      primaryTrade: 'general-construction',
      teamSize: 'solo',
      businessStage: 'starting-out',
      monthlyQuoteVolume: '0-10',
      address: '',
      website: '',
      taxId: '',
      revenueRange: 'pre-revenue',
      heardAboutUs: 'google',
      primaryGoals: '',
      marketingConsent: false,
      authProvider: 'google'
    })

    router.push('/app/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Google sign-in failed.'
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

.social-btn {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 999px;
  background: white;
  padding: 0.9rem 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.social-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(31, 111, 120, 0.4);
}

.social-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.social-btn__mark {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f3f4f6;
  color: #0f172a;
  font-weight: 800;
}

@media (max-width: 920px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
}
</style>
