<template>
  <svg
    class="brand-logo"
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    role="img"
    aria-label="FundaNathi Tutoring Service logo"
  >
    <defs>
      <linearGradient id="tsl-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4cd494" />
        <stop offset="55%" stop-color="#2f9e69" />
        <stop offset="100%" stop-color="#256d51" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="17" fill="url(#tsl-gradient)" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
    <polygon points="32,13 55,21.5 32,30 9,21.5" fill="#ffffff" />
    <path d="M24.5 27.5V32.7C24.5 35.9 39.5 35.9 39.5 32.7V27.5L32 30.2Z" fill="#d9f2e5" />
    <path d="M51 24v6.5" stroke="#ffd76e" stroke-width="2.6" stroke-linecap="round" fill="none" />
    <circle cx="51" cy="33" r="2.8" fill="#ffd76e" />
    <path d="M12 41C18.5 37.4 25.5 37.4 32 41.2C38.5 37.4 45.5 37.4 52 41L52 50.4C45.5 46.8 38.5 46.8 32 50.6C25.5 46.8 18.5 46.8 12 50.4Z" fill="#ffffff" />
    <path d="M32 41.2V50.6" stroke="#256d51" stroke-width="1.6" stroke-linecap="round" />
  </svg>
</template>

<script>
export default {
  name: 'BrandLogo',
  props: {
    size: { type: [Number, String], default: 64 }
  }
}
</script>

