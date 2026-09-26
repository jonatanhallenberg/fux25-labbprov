import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import LoansView from '../views/LoansView.vue'
import ReserveView from '../views/ReserveView.vue'
import MessagesView from '../views/MessagesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/lan', component: LoansView, meta: { requiresAuth: true } },
    { path: '/reservera', component: ReserveView, meta: { requiresAuth: true } },
    { path: '/meddelanden', component: MessagesView, meta: { requiresAuth: true } }
  ]
})

// Route guard = användarupplevelse, inte säkerhet. Skyddet sitter i API:t:
// utan giltig token får ingen sida några data, guard eller inte.
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { path: '/login', query: { redirect: to.fullPath } }
  if (to.path === '/login' && auth.isAuthenticated) return '/'
})

export default router
