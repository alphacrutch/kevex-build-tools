<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="brand-block">
        <div class="brand-logo">K</div>
        <div>
          <h1>Kevex ProBuild</h1>
          <p>Estimate. Track. Profit.</p>
        </div>
      </div>

      <nav class="nav-list">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" @click="sidebarOpen = false">
          {{ item.label }}
        </RouterLink>
      </nav>

      <BaseButton class="logout-btn" variant="outline" full-width @click="handleLogout">Logout</BaseButton>
    </aside>

    <div class="main-area">
      <header class="topbar card">
        <button class="menu-btn" type="button" @click="sidebarOpen = !sidebarOpen">Menu</button>
        <div>
          <strong>Kevex ProBuild Suite</strong>
        </div>
      </header>

      <main class="page-wrap">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/authStore'

const sidebarOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/estimator', label: 'Estimator' },
  { to: '/app/quotes', label: 'Quotes' },
  { to: '/app/clients', label: 'Clients' },
  { to: '/app/jobs', label: 'Jobs' }
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.15), transparent 36%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background: rgba(255, 255, 255, 0.92);
  border-right: 1px solid rgba(148, 163, 184, 0.22);
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  backdrop-filter: blur(14px);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.brand-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1d4ed8, #0f766e);
  color: white;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  font-weight: 800;
}

.brand-block h1 {
  margin: 0;
  font-size: 1.15rem;
}

.brand-block p {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  color: var(--muted);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.nav-list a {
  text-decoration: none;
  color: var(--ink);
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  font-weight: 600;
}

.nav-list a.router-link-active {
  background: rgba(29, 78, 216, 0.12);
  color: var(--brand);
}

.logout-btn {
  margin-top: auto;
}

.main-area {
  min-width: 0;
}

.topbar {
  margin: 1.25rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 1rem;
  z-index: 20;
}

.page-wrap {
  padding: 0 1.25rem 1.25rem;
}

.menu-btn {
  display: none;
  border: none;
  background: white;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 920px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    z-index: 30;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .menu-btn {
    display: inline-flex;
  }
}
</style>
