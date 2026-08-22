import Vue from 'vue'
import VueRouter from 'vue-router'
import { getSession } from '@/services/authService'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/student-home', name: 'student-home', component: HomeView, meta: { requiresAuth: true, role: 'student' } },
  { path: '/tutor-home', name: 'tutor-home', component: HomeView, meta: { requiresAuth: true, role: 'tutor' } },
  { path: '/admin-home', name: 'admin-home', component: HomeView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/change-password', name: 'change-password', component: ChangePasswordView, meta: { requiresAuth: true } },
  { path: '*', redirect: '/login' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const session = getSession()
  if (to.meta.requiresAuth && !session) {
    return next('/login')
  }
  if (to.meta.role && session && session.role !== to.meta.role) {
    return next(`/${session.role}-home`)
  }
  if ((to.name === 'login' || to.name === 'register') && session) {
    return next(`/${session.role}-home`)
  }
  next()
})

export default router
