<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import ParkingMap from '../components/ParkingMap.vue'
import ChatWidget from '../components/ChatWidget.vue'
import { useParkingMapStore } from '../stores/parkingMapStore'
import { useBookingStore } from '../stores/bookingStore'
import { startSensorSimulation, stopSensorSimulation } from '../services/mockApi'

const parking = useParkingMapStore()
const booking = useBookingStore()
const { freeSpots } = storeToRefs(parking)
const { activeBooking } = storeToRefs(booking)

const freeList = computed(() =>
  [...freeSpots.value].sort((a, b) => a.price - b.price).slice(0, 12)
)

onMounted(() => {
  startSensorSimulation()
})

onUnmounted(() => {
  stopSensorSimulation()
})
</script>

<template>
  <div class="page">
    <section class="hero">
      <div>
        <h1>Smart Parking</h1>
        <p class="lead">Карта, бронирование и чат-ассистент в одном SPA.</p>
      </div>
      <div class="entrances">
        <span v-for="e in parking.entrances" :key="e.id" class="pill">{{ e.label }}</span>
      </div>
    </section>

    <div class="layout">
      <div class="col">
        <ParkingMap />
        <section class="card" data-testid="free-list">
          <h3>Свободные места (топ по цене)</h3>
          <ul>
            <li v-for="s in freeList" :key="s.id">
              <strong>{{ s.id }}</strong>
              <span class="muted">· {{ s.price }} ₽/ч · вход {{ s.entranceId }}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="col">
        <ChatWidget />
        <section class="card" data-testid="booking-card">
          <h3>Моё бронирование</h3>
          <p v-if="!activeBooking" class="muted">Пока нет активной брони.</p>
          <div v-else class="booking">
            <p>
              <strong>{{ activeBooking.spotId }}</strong>
            </p>
            <p class="muted">
              {{ new Date(activeBooking.start).toLocaleString('ru-RU') }} —
              {{ new Date(activeBooking.end).toLocaleString('ru-RU') }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px 16px 40px;
}
.hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
h1 {
  margin: 0 0 6px;
  font-size: 26px;
}
.lead {
  margin: 0;
  color: var(--muted);
}
.entrances {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.pill {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #334155;
  color: var(--muted);
}
.layout {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 14px;
}
@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
.col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
}
.card h3 {
  margin: 0 0 8px;
  font-size: 14px;
}
ul {
  margin: 0;
  padding-left: 18px;
  color: var(--text);
  font-size: 13px;
}
.muted {
  color: var(--muted);
}
.booking strong {
  color: var(--accent);
}
</style>
