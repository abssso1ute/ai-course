<script setup>
import { computed } from 'vue'

const props = defineProps({
  vehicles: { type: Array, default: () => [] },
  filtered: { type: Array, default: () => [] }
})

const onLine = computed(() => props.vehicles.length)
const avgSpeed = computed(() => {
  const list = props.filtered.length ? props.filtered : props.vehicles
  if (!list.length) return '—'
  const sum = list.reduce((acc, v) => acc + Number(v.speedKmh ?? 0), 0)
  return Math.round(sum / list.length)
})

const scheduleKpi = computed(() => {
  const list = props.filtered.length ? props.filtered : props.vehicles
  if (!list.length) return '—'
  const ok = list.filter((v) => Math.abs(Number(v.delayMin ?? 0)) <= 2).length
  return `${Math.round((ok / list.length) * 100)}%`
})
</script>

<template>
  <div class="kpi">
    <div class="tile">
      <div class="label">ТС на линии (снимок)</div>
      <div class="value">{{ onLine }}</div>
    </div>
    <div class="tile">
      <div class="label">Средняя скорость (фильтр)</div>
      <div class="value">{{ avgSpeed }}</div>
    </div>
    <div class="tile">
      <div class="label">Рейсы «в графике» ±2 мин</div>
      <div class="value">{{ scheduleKpi }}</div>
    </div>
  </div>
</template>

<style scoped>
.kpi {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.tile {
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 10px;
  padding: 10px 12px;
}
.label {
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 4px;
}
.value {
  font-size: 20px;
  font-weight: 650;
}
</style>
