<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="brand">Tutoring Service</router-link>
      <div v-if="session" class="links">
        <span class="user">Hi, {{ session.name }} ({{ session.role }})</span>
        <router-link to="/profile">Profile</router-link>
        <button type="button" @click="doLogout">Logout</button>
      </div>
      <div v-else class="links">
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { getSession, logout } from '@/services/authService'

export default {
  name: 'App',
  data() {
    return {
      session: getSession()
    }
  },
  watch: {
    $route() {
      this.session = getSession()
    }
  },
  methods: {
    doLogout() {
      logout()
      this.session = null
      this.$router.push('/login')
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background: #f5f7fa;
  color: #2c3e50;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #2c3e50;
}

.navbar .brand {
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  font-size: 18px;
}

.navbar .links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.navbar a {
  color: #dfe6ee;
  text-decoration: none;
}

.navbar a.router-link-active {
  color: #42b983;
}

.navbar .user {
  color: #aeb9c6;
  font-size: 14px;
}

.navbar button {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: #fff;
  cursor: pointer;
}

.auth-page,
.home-page {
  max-width: 420px;
  margin: 40px auto;
  text-align: center;
  padding: 0 16px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.tabs button {
  padding: 8px 18px;
  border: 1px solid #2c3e50;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.tabs button.active {
  background: #2c3e50;
  color: #fff;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card input {
  padding: 10px;
  border: 1px solid #ccd4dd;
  border-radius: 4px;
  font-size: 14px;
}

.card button[type='submit'] {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}

.card button[type='submit']:disabled {
  background: #9fd8bf;
  cursor: not-allowed;
}

.error {
  color: #c0392b;
  margin: 0;
}

.success {
  color: #27ae60;
  margin: 0;
}

.switch {
  margin-top: 16px;
}

.links-card {
  align-items: stretch;
}

.muted {
  color: #7f8c8d;
}
</style>
