<template>
  <div class="home-page">
    <h1>Welcome, {{ session.name }}</h1>
    <p>You are logged in as a <strong>{{ session.role }}</strong>.</p>
    <p class="muted">Placeholder page — the {{ session.role }} features will be built here.</p>

    <div class="card links-card">
      <router-link to="/change-password">Change Password</router-link>
    </div>
  </div>
</template>

<script>
import { getSession } from '@/services/authService'

export default {
  name: 'HomeView',
  data() {
    return {
      session: getSession()
    }
  }
}
</script>
