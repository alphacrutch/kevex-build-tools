<template>
  <section class="register-page">
    <div class="register-layout">
      <aside class="register-side card">
        <p class="eyebrow">Account setup</p>
        <h1>Build a profile that works for operations and future growth.</h1>
        <p>
          We collect the business details needed to personalize quoting, support onboarding, understand account
          quality, and create a healthier commercial pipeline over time.
        </p>

        <ul class="register-benefits">
          <li>Unlimited calculators and saved estimating history</li>
          <li>Structured owner and business data for future product logic</li>
          <li>Commercial insights that can support pricing and retention later</li>
        </ul>
      </aside>

      <div class="register-card card">
        <div class="auth-head">
          <h2>Create your Kevex account</h2>
          <p>Set up the owner profile, business basics, and growth context in one pass.</p>
        </div>

        <div class="social-actions">
          <button class="social-btn" type="button" :disabled="authStore.loading" @click="handleGoogleRegister">
            <span class="social-btn__mark">G</span>
            <span>Continue with Google</span>
          </button>
          <p class="helper-text">Prefer email and password? Complete the form below.</p>
        </div>

        <form class="form-grid" @submit.prevent="handleRegister">
          <section class="section-block">
            <h3>Owner access</h3>
            <div class="two-col-grid">
              <BaseInput v-model="form.ownerFirstName" label="First Name" placeholder="Alicia" />
              <BaseInput v-model="form.ownerLastName" label="Last Name" placeholder="Stone" />
              <BaseInput v-model="form.email" label="Work Email" type="email" placeholder="owner@company.com" />
              <BaseInput v-model="form.phone" label="Phone" placeholder="+1 555 123 4567" />
              <BaseInput v-model="form.password" label="Password" type="password" placeholder="Create password" />
              <BaseInput
                v-model="form.confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
              />
            </div>
          </section>

          <section class="section-block">
            <h3>Business profile</h3>
            <div class="two-col-grid">
              <BaseInput v-model="form.businessName" label="Business Name" placeholder="Kevex Interiors LLC" />
              <BaseInput v-model="form.operatingRegion" label="Primary Region" placeholder="Phoenix Metro" />
              <BaseSelect v-model="form.primaryTrade" label="Primary Trade" :options="tradeOptions" />
              <BaseSelect v-model="form.teamSize" label="Team Size" :options="teamSizeOptions" />
              <BaseSelect v-model="form.businessStage" label="Business Stage" :options="businessStageOptions" />
              <BaseSelect v-model="form.monthlyQuoteVolume" label="Monthly Quote Volume" :options="quoteVolumeOptions" />
            </div>
            <BaseTextarea
              v-model="form.address"
              label="Business Address"
              rows="3"
              placeholder="Street, city, state, postal code"
            />
          </section>

          <section class="section-block">
            <h3>Commercial context</h3>
            <div class="two-col-grid">
              <BaseInput v-model="form.website" label="Website" placeholder="https://company.com" />
              <BaseInput v-model="form.taxId" label="Tax ID / Registration No." placeholder="Optional" />
              <BaseSelect v-model="form.revenueRange" label="Annual Revenue Range" :options="revenueOptions" />
              <BaseSelect v-model="form.heardAboutUs" label="How did you hear about us?" :options="leadSourceOptions" />
            </div>
            <BaseTextarea
              v-model="form.primaryGoals"
              label="Current goals"
              rows="4"
              placeholder="Win more quotes, standardize estimating, centralize client records..."
            />
          </section>

          <label class="check-row">
            <input v-model="form.marketingConsent" type="checkbox" />
            <span>I’m happy to receive product updates, onboarding guidance, and future commercial offers.</span>
          </label>

          <label class="check-row">
            <input v-model="form.acceptTerms" type="checkbox" />
            <span>I confirm the information is accurate and I want to create this workspace.</span>
          </label>

          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

          <div class="actions-row">
            <BaseButton type="submit" :loading="authStore.loading">
              {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
            </BaseButton>
            <RouterLink class="btn btn--outline" to="/login">Already have an account?</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { useAuthStore } from '@/stores/authStore'
import { createUserProfile } from '@/services/userProfileService'
import { ensureUserProfile } from '@/services/userProfileService'

const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

const tradeOptions = [
  { value: 'general-construction', label: 'General Construction' },
  { value: 'tiling', label: 'Tiling' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'painting', label: 'Painting' },
  { value: 'other', label: 'Other Trade' }
]

const teamSizeOptions = [
  { value: 'solo', label: 'Solo Operator' },
  { value: '2-5', label: '2-5 People' },
  { value: '6-15', label: '6-15 People' },
  { value: '16+', label: '16+ People' }
]

const businessStageOptions = [
  { value: 'starting-out', label: 'Starting Out' },
  { value: 'growing', label: 'Growing' },
  { value: 'established', label: 'Established' },
  { value: 'expanding', label: 'Expanding to New Markets' }
]

const quoteVolumeOptions = [
  { value: '0-10', label: '0-10 Quotes' },
  { value: '11-25', label: '11-25 Quotes' },
  { value: '26-50', label: '26-50 Quotes' },
  { value: '50+', label: '50+ Quotes' }
]

const revenueOptions = [
  { value: 'pre-revenue', label: 'Pre-Revenue' },
  { value: '0-100k', label: '$0-$100k' },
  { value: '100k-500k', label: '$100k-$500k' },
  { value: '500k-1m', label: '$500k-$1M' },
  { value: '1m+', label: '$1M+' }
]

const leadSourceOptions = [
  { value: 'search', label: 'Search / Web' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social Media' },
  { value: 'partner', label: 'Partner / Agency' },
  { value: 'event', label: 'Industry Event' },
  { value: 'other', label: 'Other' }
]

const form = reactive({
  ownerFirstName: '',
  ownerLastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
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
  heardAboutUs: 'search',
  primaryGoals: '',
  marketingConsent: true,
  acceptTerms: false
})

const handleRegister = async () => {
  errorMessage.value = ''

  if (
    !form.ownerFirstName.trim() ||
    !form.ownerLastName.trim() ||
    !form.email.trim() ||
    !form.password ||
    !form.businessName.trim()
  ) {
    errorMessage.value = 'Please complete the required owner and business fields.'
    return
  }

  if (form.password.length < 6) {
    errorMessage.value = 'Passwords must be at least 6 characters.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (!form.acceptTerms) {
    errorMessage.value = 'Please confirm the account information before continuing.'
    return
  }

  try {
    const user = await authStore.register({
      email: form.email.trim(),
      password: form.password,
      displayName: `${form.ownerFirstName.trim()} ${form.ownerLastName.trim()}`
    })

    await createUserProfile(user.uid, {
      ownerFirstName: form.ownerFirstName.trim(),
      ownerLastName: form.ownerLastName.trim(),
      ownerFullName: `${form.ownerFirstName.trim()} ${form.ownerLastName.trim()}`,
      email: form.email.trim(),
      phone: form.phone.trim(),
      businessName: form.businessName.trim(),
      operatingRegion: form.operatingRegion.trim(),
      primaryTrade: form.primaryTrade,
      teamSize: form.teamSize,
      businessStage: form.businessStage,
      monthlyQuoteVolume: form.monthlyQuoteVolume,
      address: form.address.trim(),
      website: form.website.trim(),
      taxId: form.taxId.trim(),
      revenueRange: form.revenueRange,
      heardAboutUs: form.heardAboutUs,
      primaryGoals: form.primaryGoals.trim(),
      marketingConsent: form.marketingConsent
    })

    router.push('/app/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create your account.'
  }
}

const handleGoogleRegister = async () => {
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
.register-page {
  min-height: 100vh;
  padding: 1.25rem;
  background:
    radial-gradient(circle at top left, rgba(31, 111, 120, 0.16), transparent 28%),
    linear-gradient(180deg, #f9fafb 0%, #eef6f7 100%);
}

.register-layout {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.15fr);
  gap: 1rem;
  align-items: start;
}

.register-side,
.register-card {
  padding: 1.6rem;
}

.register-side {
  position: sticky;
  top: 1rem;
  background:
    linear-gradient(180deg, rgba(16, 24, 40, 0.96), rgba(31, 111, 120, 0.96)),
    #18212f;
  color: white;
}

.register-side h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.1rem);
  line-height: 1;
}

.register-benefits {
  padding-left: 1.1rem;
  display: grid;
  gap: 0.85rem;
  color: rgba(255, 255, 255, 0.82);
}

.section-block {
  display: grid;
  gap: 1rem;
  padding: 1rem 0 0.25rem;
  border-top: 1px solid rgba(148, 163, 184, 0.22);
}

.section-block h3 {
  margin: 0;
}

.social-actions {
  display: grid;
  gap: 0.75rem;
}

.social-btn {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 999px;
  background: white;
  padding: 0.95rem 1.1rem;
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

.check-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: var(--muted);
}

.check-row input {
  margin-top: 0.18rem;
}

@media (max-width: 980px) {
  .register-layout {
    grid-template-columns: 1fr;
  }

  .register-side {
    position: static;
  }
}
</style>
