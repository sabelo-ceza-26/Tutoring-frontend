<template>
  <div class="auth-page">
    <h2>Admin Login</h2>
 
    <form class="card" @submit.prevent="submit">
      <input v-model.trim="email" type="email" placeholder="Admin email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
 
    <p class="switch muted">Admin accounts are created by an existing administrator.</p>
  </div>
</template>
 
<script>
import { adminLogin } from '@/services/adminService'
 
export default {
  name: 'AdminLogin',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    async submit() {
      this.loading = true
      this.error = ''
      try {
        const admin = await adminLogin(this.email, this.password)
        if (!admin) throw new Error('Invalid email or password')
        this.$router.push('/admin')
      } catch (e) {
        this.error = e.message || 'Login failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>