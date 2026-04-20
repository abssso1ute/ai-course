<script setup>
import { computed, ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  stopA: { type: String, default: 'Университет' },
  stopB: { type: String, default: 'Парк Культуры' }
})

const labels = ref([])
const values = ref([])

async function load() {
  const params = new URLSearchParams({
    nameA: props.stopA,
    nameB: props.stopB
  })
  const res = await fetch(`/api/stops/compare?${params}`)
  if (!res.ok) return
  const data = await res.json()
  labels.value = data.labels || []
  values.value = data.values || []
}

watch(
  () => [props.stopA, props.stopB],
  () => load(),
  { immediate: true }
)

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Пассажиропоток (усл. ед., мок)',
      data: values.value,
      backgroundColor: ['#22c55eaa', '#f59e0baa'],
      borderColor: ['#22c55e', '#f59e0b'],
      borderWidth: 1
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 240 },
  plugins: { legend: { labels: { color: '#cbd5e1' } } },
  scales: {
    x: {
      ticks: { color: '#94a3b8' },
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
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<style scoped>
.chart-wrap {
  height: 240px;
}
</style>
