import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const role = ref('dispatcher')
  const chartsVisible = ref(true)
  const metricsVisible = ref(true)
  const selectedRouteNumber = ref('555')

  function setRole(r) {
    role.value = r === 'analyst' ? 'analyst' : 'dispatcher'
  }

  function setChartsVisible(v) {
    chartsVisible.value = !!v
  }

  function setMetricsVisible(v) {
    metricsVisible.value = !!v
  }

  function setSelectedRouteNumber(n) {
    selectedRouteNumber.value = String(n || '555')
  }

  return {
    role,
    chartsVisible,
    metricsVisible,
    selectedRouteNumber,
    setRole,
    setChartsVisible,
    setMetricsVisible,
    setSelectedRouteNumber
  }
})
