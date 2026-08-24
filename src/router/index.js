import Vue from 'vue'
import VueRouter from 'vue-router'
import { getSession } from '@/services/authService'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import HomeView from '@/views/Shared/HomeView.vue'
import StudentManagement from '@/views/Student/StudentManagement.vue'
import ChangePasswordView from '@/views/Auth/ChangePasswordView.vue'
import ResetPasswordView from '@/views/Auth/ResetPasswordView.vue'
import TutorManagement from '@/views/Tutor/TutorManagement.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/student-home', name: 'student-home', component: StudentManagement, meta: { requiresAuth: true, role: 'student' } },
  { path: '/profile', name: 'profile', component: StudentManagement, meta: { requiresAuth: true, role: 'student' } },
  { path: '/tutor-home', name: 'tutor-home', component: TutorManagement, meta: { requiresAuth: true, role: 'tutor' } },
  { path: '/admin-home', name: 'admin-home', component: HomeView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/change-password', name: 'change-password', component: ChangePasswordView, meta: { requiresAuth: true } },
  { path: '/reset-password', name: 'reset-password', component: ResetPasswordView },
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
