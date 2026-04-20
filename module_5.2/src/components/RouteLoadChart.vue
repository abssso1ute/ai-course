<script setup>
import { computed, ref, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const props = defineProps({
  routeNumber: { type: String, default: '555' },
  days: { type: Number, default: 7 }
})

const labels = ref([])
const values = ref([])

async function load() {
  const r = encodeURIComponent(props.routeNumber)
  const res = await fetch(`/api/history/route/${r}?days=${props.days}`)
  if (!res.ok) return
  const data = await res.json()
  labels.value = data.labels || []
  values.value = data.loads || []
}

watch(
  () => [props.routeNumber, props.days],
  () => load(),
  { immediate: true }
)

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: `Загрузка (маршрут ${props.routeNumber})`,
      data: values.value,
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.12)',
      tension: 0.25,
      fill: true
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 280 },
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { labels: { color: '#cbd5e1' } } },
  scales: {
    x: {
      ticks: { color: '#94a3b8', maxTicksLimit: 12 },
      grid: { color: '#1f2937' }
    },
    y: {
      ticks: { color: '#94a3b8' },
      grid: { color: '#1f2937' }
    }
  }
}
</script>

<template>
  <div class="chart-wrap">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<style scoped>
.chart-wrap {
  height: 260px;
}
</style>
