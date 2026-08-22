<template>
  <div class="auth-page">
    <h1>Change Password</h1>

    <p v-if="session.role === 'admin'" class="card error">
      Admin accounts do not have a password in the current system.
    </p>

    <form v-else class="card" @submit.prevent="submit">
      <input v-model="currentPassword" type="password" placeholder="Current Password" required>
      <input v-model="newPassword" type="password" placeholder="New Password" minlength="4" required>
      <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" required>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Password changed successfully.</p>
      <button type="submit" :disabled="loading">{{ loading ? 'Saving...' : 'Save New Password' }}</button>
    </form>

    <p class="switch">
      <router-link to="/">Back to home</router-link>
    </p>
  </div>
</template>

<script>
import { getSession } from '@/services/authService'
import { changeStudentPassword, changeTutorPassword } from '@/services/authService'

export default {
  name: 'ChangePasswordView',
  data() {
    return {
      session: getSession(),
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
      success: false,
      loading: false
    }
  },
  methods: {
    async submit() {
      this.error = ''
      this.success = false
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'New passwords do not match'
        return
      }
      this.loading = true
      try {
        if (this.session.role === 'student') {
          await changeStudentPassword(this.session.id, this.currentPassword, this.newPassword)
        } else {
          await changeTutorPassword(this.session.id, this.currentPassword, this.newPassword)
        }
        this.success = true
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
