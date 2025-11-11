import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('../views/Overview.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/new-transaction',
    name: 'NewTransaction',
    component: () => import('../views/NewTransaction.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transaction-log',
    name: 'TransactionLog',
    component: () => import('../views/TransactionLog.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-log',
    name: 'EditLog',
    component: () => import('../views/EditLog.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage
  if (!authStore.isAuthenticated) {
    authStore.initAuth()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } 
  // Check if route requires admin access
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Overview' })
  }
  // Check if route requires guest (not authenticated)
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Overview' })
  } 
  else {
    next()
  }
})

export default router