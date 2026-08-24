<template>
  <div id="app">
    <transition name="splash-fade">
      <div v-if="showSplash" class="splash-screen" aria-hidden="true">
        <div class="splash-inner">
          <div class="splash-logo-wrap">
            <span class="splash-ring r1"></span>
            <span class="splash-ring r2"></span>
            <brand-logo :size="104" class="splash-logo" />
          </div>
          <h1 class="splash-title">FundaNathi Tutoring Service</h1>
          <p class="splash-tagline">Learn brighter &middot; Teach further</p>
          <div class="splash-bar"><span class="splash-bar-fill"></span></div>
        </div>
      </div>
    </transition>

    <nav class="navbar">
      <router-link to="/" class="brand">
        <brand-logo :size="30" />
        <span>FundaNathi Tutoring Service</span>
      </router-link>
      <div v-if="session" class="links">
        <span class="user">Hi, {{ session.name }} ({{ session.role }})</span>
        <router-link to="/profile">Profile</router-link>
        <button type="button" @click="doLogout">Logout</button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
import { getSession, logout } from '@/services/authService'
import BrandLogo from '@/components/BrandLogo.vue'

export default {
  name: 'App',
  components: {
    BrandLogo
  },
  data() {
    return {
      session: getSession(),
      showSplash: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.showSplash = false
    }, 2600)
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
  display: inline-flex;
  align-items: center;
  gap: 10px;
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

/* SPLASH SCREEN */
.splash-screen {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 18% 22%, rgba(76, 212, 148, 0.26), transparent 44%),
    radial-gradient(circle at 82% 78%, rgba(66, 185, 131, 0.16), transparent 46%),
    linear-gradient(135deg, #16283a 0%, #1d3a50 48%, #123528 100%);
}

.splash-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
}

.splash-logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
  animation: splash-pop 0.9s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
}

.splash-ring {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid rgba(76, 212, 148, 0.55);
  animation: splash-ring 2s ease-out infinite;
}

.splash-ring.r2 {
  animation-delay: 0.55s;
}

.splash-title {
  margin: 0;
  color: #fff;
  font-size: clamp(24px, 5vw, 40px);
  font-weight: 800;
  letter-spacing: 0.06em;
  animation: splash-track 1.4s ease 0.25s both;
}

.splash-tagline {
  margin: 12px 0 38px;
  color: rgba(223, 230, 238, 0.72);
  font-size: 14px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  animation: splash-fade-up 1s ease 0.65s both;
}

.splash-bar {
  width: 190px;
  height: 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.16);
  overflow: hidden;
}

.splash-bar-fill {
  display: block;
  height: 100%;
  width: 0;
  border-radius: 99px;
  background: linear-gradient(90deg, #4cd494, #baf3d4);
  box-shadow: 0 0 12px rgba(76, 212, 148, 0.8);
  animation: splash-fill 2.3s cubic-bezier(0.3, 0.6, 0.3, 1) forwards;
}

@keyframes splash-pop {
  from {
    opacity: 0;
    transform: scale(0.55) rotate(-8deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes splash-ring {
  0% {
    transform: scale(0.62);
    opacity: 0.85;
  }
  70% {
    opacity: 0.25;
  }
  100% {
    transform: scale(1.28);
    opacity: 0;
  }
}

@keyframes splash-track {
  from {
    opacity: 0;
    letter-spacing: 0.4em;
    filter: blur(6px);
  }
  to {
    opacity: 1;
    letter-spacing: 0.06em;
    filter: blur(0);
  }
}

@keyframes splash-fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes splash-fill {
  to {
    width: 100%;
  }
}

.splash-fade-leave-active {
  transition: opacity 0.55s ease;
}

.splash-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .splash-ring {
    display: none;
  }

  .splash-logo-wrap,
  .splash-title,
  .splash-tagline,
  .splash-bar-fill {
    animation-duration: 0.01s !important;
    animation-delay: 0s !important;
  }
}
</style>
