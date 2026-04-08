import AppShell from '@/components/AppShell.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/LandingPage.vue')
  },
  {
    path: '/calculators',
    name: 'calculators',
    component: () => import('@/pages/QuickCalculatorsPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/app',
    component: AppShell,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/app/dashboard'
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue')
      },
      {
        path: 'estimator',
        name: 'estimator',
        component: () => import('@/pages/EstimatorPage.vue')
      },
      {
        path: 'quotes',
        name: 'quotes',
        component: () => import('@/pages/QuotesPage.vue')
      },
      {
        path: 'clients',
        name: 'clients',
        component: () => import('@/pages/ClientsPage.vue')
      },
      {
        path: 'jobs',
        name: 'jobs',
        component: () => import('@/pages/JobsPage.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
