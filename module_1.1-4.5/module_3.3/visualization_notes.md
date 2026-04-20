Вывод (3 главных принципа)

Данные должны быть правильно структурированы под конкретную библиотеку (Chart.js, D3 и т.д.)
Интерактивность графиков требует продуманного управления состоянием и обновлениями
Хорошая визуализация — это не только внешний вид, но и:
производительность
доступность (a11y)
читаемость данных без графики



<template>
  <div
    role="img"
    :aria-label="ariaLabel"
  >
    <canvas ref="chartRef"></canvas>

    <!-- доступное текстовое описание -->
    <span class="sr-only">
      {{ textDescription }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { Chart } from "chart.js";

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
});

const chartRef = ref(null);
let chartInstance = null;

const ariaLabel = computed(() => {
  return "Диаграмма статуса задач (выполнено и не выполнено)";
});

const textDescription = computed(() => {
  return props.chartData
    .map(item => `${item.title}: ${item.completed ? "выполнено" : "не выполнено"}`)
    .join(". ");
});

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = props.chartData.map(i => i.title);
  const data = props.chartData.map(i => (i.completed ? 1 : 0));

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Tasks status",
          data
        }
      ]
    },
    options: {
      responsive: true,
      animation: false // улучшение производительности
    }
  });
};

onMounted(() => {
  renderChart();
});

watch(() => props.chartData, () => {
  renderChart();
}, { deep: true });
</script>

<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
</style>