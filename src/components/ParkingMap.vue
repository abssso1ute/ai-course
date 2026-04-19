<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useParkingMapStore } from '../stores/parkingMapStore'
import ParkingSpotCell from './ParkingSpotCell.vue'

const parking = useParkingMapStore()
const { spots, highlightedSpotId } = storeToRefs(parking)

const grid = computed(() => {
  const map = new Map()
  for (const s of spots.value) {
    map.set(`${s.coordinates.row}-${s.coordinates.col}`, s)
  }
  const rows = []
  for (let r = 0; r < parking.ROWS; r += 1) {
    const row = []
    for (let c = 0; c < parking.COLS; c += 1) {
      row.push(map.get(`${r}-${c}`) || null)
    }
    rows.push(row)
  }
  return rows
})
</script>

<template>
  <section class="map" aria-label="Карта парковки">
    <header class="map-head">
      <h2>Карта</h2>
      <ul class="legend">
        <li><span class="sw free" /> свободно</li>
        <li><span class="sw occupied" /> занято</li>
        <li><span class="sw reserved" /> забронировано</li>
        <li><span class="sw inactive" /> не в продаже</li>
      </ul>
    </header>
    <div class="grid" data-testid="parking-grid">
      <div v-for="(row, ri) in grid" :key="ri" class="row">
        <ParkingSpotCell
          v-for="(spot, ci) in row"
          :key="`${ri}-${ci}`"
          v-memo="[
            spot?.status,
            spot?.price,
            spot?.inactive,
            spot?.id === highlightedSpotId
          ]"
          :spot="spot"
          :highlighted="!!spot && spot.id === highlightedSpotId"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.map {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
}
.map-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
h2 {
  margin: 0;
  font-size: 16px;
}
.legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  padding: 0;
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
.legend li {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sw {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
  border: 1px solid #374151;
}
.sw.free {
  background: rgba(34, 197, 94, 0.35);
}
.sw.occupied {
  background: rgba(239, 68, 68, 0.35);
}
.sw.reserved {
  background: rgba(234, 179, 8, 0.35);
}
.sw.inactive {
  background: #0f172a;
}
.grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.row {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 4px;
}
@media (max-width: 900px) {
  .row {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
}
</style>
