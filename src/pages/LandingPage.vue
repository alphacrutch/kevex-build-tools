<template>
  <div class="landing-page">
    <header class="landing-nav">
      <RouterLink class="brand" to="/">
        <span class="brand__badge">K</span>
        <span>
          <strong>Kevex Build Tools</strong>
          <small>Quote jobs. Track profit. Send invoices.</small>
        </span>
      </RouterLink>

      <nav class="landing-nav__actions">
        <RouterLink class="nav-link" to="/calculators">Calculators</RouterLink>
        <RouterLink class="nav-link" to="/login">Login</RouterLink>
        <RouterLink class="btn btn--primary" to="/register">Start Free</RouterLink>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">Built for contractors and trade teams</p>
          <h1>Generate quotes in minutes and track every dollar on the job.</h1>
          <p class="hero__lede">
            Kevex helps contractors price jobs faster, calculate materials automatically, save clients,
            monitor job profit, and send clean professional invoices from one simple workspace.
          </p>

          <div class="actions-row hero__actions">
            <RouterLink class="btn btn--primary" to="/register">Create Free Workspace</RouterLink>
            <RouterLink class="btn btn--outline" to="/calculators">Try Free Calculators</RouterLink>
            <button class="btn btn--outline" type="button" :disabled="!canInstall || installLoading" @click="handleInstall">
              {{ installButtonLabel }}
            </button>
          </div>

          <p class="install-note">
            {{ installMessage }}
          </p>

          <div class="hero__highlights">
            <div v-for="item in highlights" :key="item.title" class="highlight-card card">
              <strong>{{ item.title }}</strong>
              <p>{{ item.copy }}</p>
            </div>
          </div>
        </div>

        <aside class="hero__panel card">
          <p class="panel__eyebrow">What the app handles</p>
          <h2>Quote, track, invoice, repeat.</h2>

          <ul class="panel-list">
            <li>Trade-based estimators for tiling, plumbing, electrical, painting, and concrete</li>
            <li>Automatic material quantities with waste percentage built in</li>
            <li>Client records, job tracking, invoices, and quote credits in one app</li>
          </ul>

          <div class="panel__cta">
            <RouterLink class="btn btn--primary btn--full" to="/register">Launch Starter Plan</RouterLink>
          </div>
        </aside>
      </section>

      <section class="funnel-grid">
        <article class="funnel-card card">
          <p class="eyebrow">1. Estimate</p>
          <h3>Enter job type, dimensions, and material details</h3>
          <p>The app returns materials needed, labor estimate, total cost, and profit margin.</p>
        </article>

        <article class="funnel-card card">
          <p class="eyebrow">2. Convert</p>
          <h3>Turn estimates into saved quotes and invoices</h3>
          <p>Export PDFs, share on WhatsApp, and keep reusable templates for repeat work.</p>
        </article>

        <article class="funnel-card card">
          <p class="eyebrow">3. Grow</p>
          <h3>Track active jobs, expenses, and profit per client</h3>
          <p>See which jobs are making money and use credit top-ups when your quote volume spikes.</p>
        </article>
      </section>

      <section class="pricing-grid">
        <article v-for="plan in plans" :key="plan.name" class="pricing-card card">
          <p class="eyebrow">{{ plan.name }}</p>
          <h3>{{ plan.price }}</h3>
          <p>{{ plan.copy }}</p>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const deferredPrompt = ref(null)
const canInstall = ref(false)
const installLoading = ref(false)
const installAccepted = ref(false)

const highlights = [
  {
    title: 'Generate quotes in minutes',
    copy: 'Move from dimensions and material type to a full quote summary without rebuilding the math every time.'
  },
  {
    title: 'Track costs and profits',
    copy: 'Update expenses and payments received so each job shows you the real profit left on the table.'
  },
  {
    title: 'Send professional invoices',
    copy: 'Create polished PDF invoices and keep client balances organized inside the same workspace.'
  }
]

const plans = [
  { name: 'Starter', price: 'Free', copy: '3 quotes per month, basic calculator, and a clean contractor workflow.' },
  { name: 'Pro', price: '$40 TTD / month', copy: 'Unlimited quotes, material calculator, PDF export, and job tracking.' },
  { name: 'Business', price: '$100 TTD / month', copy: 'Profit tracking, client database, priority support, and credit-ready scaling.' }
]

const installButtonLabel = computed(() => {
  if (installLoading.value) {
    return 'Installing...'
  }

  if (installAccepted.value) {
    return 'App Installed'
  }

  return canInstall.value ? 'Install App' : 'Install Unavailable'
})

const installMessage = computed(() => {
  if (installAccepted.value) {
    return 'Kevex Build Tools has been added to this device, or the browser reported a successful install flow.'
  }

  if (canInstall.value) {
    return 'Install the app on this device for a full-screen experience and faster return access.'
  }

  return 'Install becomes available when the browser supports PWA install prompts and the app meets install criteria.'
})

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
  deferredPrompt.value = event
  canInstall.value = true
}

const handleAppInstalled = () => {
  installAccepted.value = true
  deferredPrompt.value = null
  canInstall.value = false
}

const handleInstall = async () => {
  if (!deferredPrompt.value) {
    return
  }

  installLoading.value = true

  try {
    await deferredPrompt.value.prompt()
    const choiceResult = await deferredPrompt.value.userChoice
    installAccepted.value = choiceResult?.outcome === 'accepted'
    canInstall.value = false
    deferredPrompt.value = null
  } finally {
    installLoading.value = false
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;
  padding: 1.25rem;
  background:
    radial-gradient(circle at top left, rgba(21, 94, 117, 0.18), transparent 30%),
    radial-gradient(circle at right center, rgba(245, 158, 11, 0.14), transparent 24%),
    linear-gradient(180deg, #fbfcf6 0%, #eef6f7 46%, #f9fafb 100%);
}

.landing-nav,
.hero,
.funnel-grid,
.pricing-grid {
  width: min(1180px, 100%);
  margin: 0 auto;
}

.landing-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  color: var(--ink);
}

.brand small {
  display: block;
  margin-top: 0.18rem;
  color: var(--muted);
}

.brand__badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1f6f78, #f59e0b);
  color: white;
  font-weight: 800;
  font-size: 1.15rem;
}

.landing-nav__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--ink);
  text-decoration: none;
  font-weight: 600;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
  gap: 1.25rem;
  padding: 3rem 0 2rem;
}

.eyebrow,
.panel__eyebrow {
  margin: 0 0 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 800;
  color: #1f6f78;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  line-height: 0.96;
  max-width: 11ch;
}

.hero__lede {
  max-width: 62ch;
  margin: 1rem 0 0;
  color: #405168;
  font-size: 1.06rem;
}

.hero__actions {
  margin-top: 1.5rem;
}

.install-note {
  margin: 0.85rem 0 0;
  color: var(--muted);
  max-width: 58ch;
}

.hero__highlights,
.funnel-grid,
.pricing-grid {
  display: grid;
  gap: 1rem;
}

.hero__highlights {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 1.5rem;
}

.funnel-grid,
.pricing-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding-bottom: 2rem;
}

.highlight-card,
.hero__panel,
.funnel-card,
.pricing-card {
  padding: 1.35rem;
}

.highlight-card,
.pricing-card {
  background: rgba(255, 255, 255, 0.75);
}

.highlight-card p,
.hero__panel p,
.funnel-card p,
.pricing-card p {
  color: var(--muted);
}

.hero__panel {
  background:
    linear-gradient(180deg, rgba(19, 78, 74, 0.98), rgba(17, 24, 39, 0.96)),
    #112030;
  color: white;
}

.hero__panel h2 {
  margin: 0;
  font-size: 1.9rem;
}

.panel-list {
  padding-left: 1.1rem;
  display: grid;
  gap: 0.85rem;
  color: rgba(255, 255, 255, 0.84);
}

.panel__cta {
  margin-top: 1.5rem;
}

@media (max-width: 960px) {
  .landing-nav,
  .hero {
    flex-direction: column;
  }

  .hero,
  .hero__highlights,
  .funnel-grid,
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}
</style>
