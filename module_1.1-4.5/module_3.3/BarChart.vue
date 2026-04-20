<template>
  <div>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Tooltip
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Tooltip
);

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
});

const chartRef = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = props.chartData.map(item => item.title);
  const data = props.chartData.map(item => (item.completed ? 1 : 0));

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Completed (1 = yes, 0 = no)",
          data,
          backgroundColor: data.map(v =>
            v === 1 ? "#4ade80" : "#f87171"
          )
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Статус задач"
        },
        legend: {
          display: true
        }
      }
    }
  });
};

onMounted(() => {
  renderChart();
});

watch(() => props.chartData, () => {
  renderChart();
});
</script>