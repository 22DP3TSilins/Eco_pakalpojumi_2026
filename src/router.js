import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Products from './components/Products.vue'
import Cart from './components/Cart.vue'
import Footprint from './components/Footprint.vue'
import Calculator from './components/Calculator.vue'
import Forum from './components/Forum.vue'
import Challenges from './components/Challenges.vue'
import Education from './components/Education.vue'
import Profile from './components/Profile.vue'
import Admin from './components/Admin.vue'
import { useAuthStore } from './stores/auth.js'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/products', component: Products },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/footprint', component: Footprint, meta: { requiresAuth: true } },
  { path: '/calculator', component: Calculator },
  { path: '/forum', component: Forum },
  { path: '/challenges', component: Challenges, meta: { requiresAuth: true } },
  { path: '/education', component: Education },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  // Initialize auth state if not already done
  if (!authStore.user && localStorage.getItem('token')) {
    authStore.initializeAuth()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresAdmin && (!authStore.isAuthenticated || authStore.user.role !== 'admin')) {
    next('/')
  } else {
    next()
  }
})

export default router