<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const online = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

function sync() {
  online.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', sync)
  window.addEventListener('offline', sync)
})

onUnmounted(() => {
  window.removeEventListener('online', sync)
  window.removeEventListener('offline', sync)
})
</script>

<template>
  <div class="app">
    <header class="top">
      <RouterLink class="brand" to="/">Smart Parking</RouterLink>
      <nav class="nav">
        <RouterLink to="/">Водитель</RouterLink>
        <RouterLink to="/admin">Админ</RouterLink>
      </nav>
    </header>
    <div v-if="!online" class="offline" role="status" data-testid="offline-banner">
      Оффлайн-режим: открыта закэшированная версия. Датчики и бронь могут быть неактуальны.
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: #0f172a;
  position: sticky;
  top: 0;
  z-index: 10;
}
.brand {
  font-weight: 700;
  text-decoration: none;
  color: var(--text);
}
.nav {
  display: flex;
  gap: 14px;
}
.nav a {
  text-decoration: none;
  color: var(--muted);
}
.nav a.router-link-active {
  color: var(--accent);
}
.offline {
  background: #422006;
  color: #ffedd5;
  padding: 8px 16px;
  font-size: 13px;
  border-bottom: 1px solid #713f12;
}
</style>
