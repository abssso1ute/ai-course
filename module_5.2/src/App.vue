<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TransportMap from '@/components/TransportMap.vue'
import RouteLoadChart from '@/components/RouteLoadChart.vue'
import StopsCompareChart from '@/components/StopsCompareChart.vue'
import KpiPanel from '@/components/KpiPanel.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import { connectRealtimeStream, fetchVehiclesOnce } from '@/services/realtimeService'
import { useRealtimeStore } from '@/stores/realtimeStore'
import { useUiStore } from '@/stores/uiStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { inBounds } from '@/utils/regions'

const realtime = useRealtimeStore()
const ui = useUiStore()
const dash = useDashboardStore()
const { vehicles, revision } = storeToRefs(realtime)
const { chartsVisible, metricsVisible, role } = storeToRefs(ui)
const { mapVehicleType, regionPreset, delayGreaterThan, chartRequest, compareStops } =
  storeToRefs(dash)

let stopStream = null

onMounted(() => {
  stopStream = connectRealtimeStream()
  fetchVehiclesOnce()
})

onBeforeUnmount(() => stopStream?.stop())

const filteredVehicles = computed(() => {
  return vehicles.value.filter((v) => {
    const typeOk = mapVehicleType.value === 'all' || v.type === mapVehicleType.value
    const geoOk = inBounds(v.lat, v.lng, regionPreset.value)
    return typeOk && geoOk
  })
})

const highlightDelayOnly = computed(() => delayGreaterThan.value !== null)
</script>

<template>
  <div class="shell">
    <header class="top">
      <div class="brand">
        <div class="title">Оперативный транспортный дашборд</div>
        <div class="muted">Модуль 5.2 · Vue 3 · мок-поток WebSocket · агент команд</div>
      </div>
      <div class="controls">
        <label class="role">
          Роль
          <select v-model="role">
            <option value="dispatcher">Диспетчер</option>
            <option value="analyst">Аналитик</option>
          </select>
        </label>
        <button type="button" class="ghost" @click="dash.resetMapFilters()">
          Сбросить фильтры карты
        </button>
      </div>
    </header>

    <main class="grid">
      <section class="map-card">
        <div class="section-head">
          <h2>Карта</h2>
          <div class="meta">
            <span :class="{ ok: realtime.connected }" class="pill">
              {{ realtime.connected ? 'Поток: online' : 'Поток: offline' }}
            </span>
            <span class="pill">ТС в кадре: {{ filteredVehicles.length }}</span>
          </div>
        </div>
        <TransportMap
          :vehicles="filteredVehicles"
          :revision="revision"
          :highlight-delay-only="highlightDelayOnly"
        />
        <p v-if="realtime.lastError" class="err">Транспорт: {{ realtime.lastError }}</p>
      </section>

      <aside class="side">
        <KpiPanel v-if="metricsVisible" :vehicles="vehicles" :filtered="filteredVehicles" />

        <div v-if="chartsVisible" class="charts">
          <div class="section-head">
            <h2>Графики</h2>
            <div class="muted small">Источник: /api/history · /api/stops</div>
          </div>
          <RouteLoadChart
            :route-number="chartRequest.routeNumber"
            :days="chartRequest.days"
          />
          <div class="section-head">
            <h3>Сравнение остановок</h3>
          </div>
          <StopsCompareChart :stop-a="compareStops.a" :stop-b="compareStops.b" />
        </div>

        <div v-else class="note">Графики скрыты (команда чата или переключатель можно вернуть в отчёте).</div>

        <ChatWidget />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  padding: 16px 18px 28px;
  max-width: 1320px;
  margin: 0 auto;
}
.top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 14px;
}
.title {
  font-size: 18px;
  font-weight: 650;
}
.muted {
  color: var(--muted);
  font-size: 12px;
}
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}
.role select {
  margin-left: 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #0b1220;
  color: var(--text);
  padding: 6px 8px;
}
.ghost {
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0b1220;
  color: var(--text);
  padding: 8px 10px;
  cursor: pointer;
}
.grid {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(320px, 1fr);
  gap: 14px;
  align-items: start;
}
.map-card {
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 14px;
  padding: 12px;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}
.section-head h2,
.section-head h3 {
  margin: 0;
  font-size: 15px;
}
.meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.pill {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--muted);
}
.pill.ok {
  border-color: #16653466;
  color: #bbf7d0;
}
.side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.charts {
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.small {
  font-size: 12px;
}
.err {
  color: #fecaca;
  font-size: 12px;
  margin: 8px 0 0;
}
.note {
  font-size: 13px;
  color: var(--muted);
  border: 1px dashed #334155;
  border-radius: 12px;
  padding: 10px;
}
@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
