<template>
  <div class="auth-page">
    <h1>Login</h1>

    <div class="tabs">
      <button type="button" :class="{ active: role === 'student' }" @click="role = 'student'">Student</button>
      <button type="button" :class="{ active: role === 'tutor' }" @click="role = 'tutor'">Tutor</button>
      <button type="button" :class="{ active: role === 'admin' }" @click="role = 'admin'">Admin</button>
    </div>

    <form class="card" @submit.prevent="submit">
      <template v-if="role !== 'admin'">
        <input v-model.trim="email" type="email" placeholder="Email" required>
        <input v-model="password" type="password" placeholder="Password" required>
      </template>
      <input v-else v-model.trim="adminId" placeholder="Admin ID" required>

      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
    </form>

    <p class="switch">
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script>
import { loginStudent, loginTutor, loginAdmin } from '@/services/authService'

export default {
  name: 'LoginView',
  data() {
    return {
      role: 'student',
      email: '',
      password: '',
      adminId: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async submit() {
      this.error = ''
      this.loading = true
      try {
        let session
        if (this.role === 'student') {
          session = await loginStudent(this.email, this.password)
        } else if (this.role === 'tutor') {
          session = await loginTutor(this.email, this.password)
        } else {
          session = await loginAdmin(this.adminId)
        }
        this.$router.push(`/${session.role}-home`)
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
