<template>
  <div class="landing-page">
    <header class="landing-nav">
      <RouterLink class="brand" to="/">
        <span class="brand__badge">K</span>
        <span>
          <strong>Kevex Build Tools</strong>
          <small>Quote faster. Close smarter.</small>
        </span>
      </RouterLink>

      <nav class="landing-nav__actions">
        <RouterLink class="nav-link" to="/calculators">Calculators</RouterLink>
        <RouterLink class="nav-link" to="/login">Login</RouterLink>
        <RouterLink class="btn btn--primary" to="/register">Register</RouterLink>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">Built for contractors and trade teams</p>
          <h1>Estimate, onboard, and convert clients from one clean workflow.</h1>
          <p class="hero__lede">
            Kevex helps you move from quick job math to real client records, saved quotes, and repeatable
            project delivery without losing the details that make a business profitable.
          </p>

          <div class="actions-row hero__actions">
            <RouterLink class="btn btn--primary" to="/register">Create Your Account</RouterLink>
            <RouterLink class="btn btn--outline" to="/calculators">Try Free Calculators</RouterLink>
          </div>

          <div class="hero__highlights">
            <div v-for="item in highlights" :key="item.title" class="highlight-card card">
              <strong>{{ item.title }}</strong>
              <p>{{ item.copy }}</p>
            </div>
          </div>
        </div>

        <aside class="hero__panel card">
          <p class="panel__eyebrow">What new accounts unlock</p>
          <h2>From one-off visitors to qualified clients</h2>

          <ul class="panel-list">
            <li>Unlimited calculators and saved quote history</li>
            <li>Structured client records for future job work</li>
            <li>Business profile data to support onboarding, billing, and product fit</li>
          </ul>

          <div class="panel__cta">
            <RouterLink class="btn btn--primary btn--full" to="/register">Start Free Setup</RouterLink>
          </div>
        </aside>
      </section>

      <section class="funnel-grid">
        <article class="funnel-card card">
          <p class="eyebrow">1. Capture</p>
          <h3>Create your company profile</h3>
          <p>
            Add your owner, company, trade, and operating details once so your workspace is ready for quoting,
            clients, and future jobs.
          </p>
        </article>

        <article class="funnel-card card">
          <p class="eyebrow">2. Estimate</p>
          <h3>Run quick numbers with confidence</h3>
          <p>
            Use the free calculators for quick one-time planning, then unlock unlimited access when you are ready
            to save quotes and work faster.
          </p>
        </article>

        <article class="funnel-card card">
          <p class="eyebrow">3. Manage</p>
          <h3>Run quotes, clients, and jobs in one system</h3>
          <p>
            Keep your estimating, client records, and active jobs connected in one place so every project is easier
            to track from first quote to final delivery.
          </p>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
const highlights = [
  {
    title: 'Fast estimating',
    copy: 'Start with quick calculators for common project planning without needing a full account first.'
  },
  {
    title: 'Organized client data',
    copy: 'Store the business and customer details you need for smoother quoting and follow-up.'
  },
  {
    title: 'One connected workspace',
    copy: 'Move from estimates to clients and jobs without jumping between disconnected tools.'
  }
]
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
.funnel-grid {
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

.hero__highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1.5rem;
}

.highlight-card,
.hero__panel,
.funnel-card {
  padding: 1.35rem;
}

.highlight-card {
  background: rgba(255, 255, 255, 0.75);
}

.highlight-card p,
.hero__panel p,
.section-heading p,
.calculator-picker p,
.funnel-card p {
  color: var(--muted);
}

.hero__panel {
  background:
    linear-gradient(180deg, rgba(19, 78, 74, 0.98), rgba(17, 24, 39, 0.96)),
    #112030;
  color: white;
  align-self: stretch;
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

.funnel-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  padding: 0 0 2rem;
}

.funnel-card h3 {
  margin: 0;
  font-size: 1.35rem;
}

@media (max-width: 960px) {
  .hero,
  .calculator-workspace,
  .funnel-grid,
  .hero__highlights,
  .calculator-grid {
    grid-template-columns: 1fr;
  }

  .landing-nav {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
