import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUiStore } from './uiStore'

/** @typedef {'all'|'nw'|'ne'|'sw'|'se'} RegionPreset */

export const useDashboardStore = defineStore('dashboard', () => {
  const mapVehicleType = ref('all')
  /** @type {import('vue').Ref<RegionPreset>} */
  const regionPreset = ref('all')
  const delayGreaterThan = ref(null)
  const chartRequest = ref({
    chartType: 'line',
    metric: 'passenger_load',
    routeNumber: '555',
    days: 7
  })
  const compareStops = ref({ a: 'Университет', b: 'Парк Культуры' })

  function applyCommand(cmd) {
    if (!cmd || typeof cmd !== 'object') return
    const { type, payload } = cmd
    switch (type) {
      case 'UPDATE_MAP_FILTER':
        if (payload?.vehicleType !== undefined && payload?.vehicleType !== null) {
          mapVehicleType.value = payload.vehicleType
        }
        if (payload?.regionPreset !== undefined && payload?.regionPreset !== null) {
          regionPreset.value = payload.regionPreset
        }
        break
      case 'SET_DELAY_THRESHOLD':
        delayGreaterThan.value =
          payload?.minutes === null || payload?.minutes === undefined ? null : Number(payload.minutes)
        break
      case 'FETCH_AND_RENDER_CHART': {
        const ui = useUiStore()
        ui.setChartsVisible(true)
        chartRequest.value = {
          chartType: payload?.chartType || 'line',
          metric: payload?.metric || 'passenger_load',
          routeNumber: String(payload?.routeNumber || chartRequest.value.routeNumber),
          days: Number(payload?.days || chartRequest.value.days)
        }
        ui.setSelectedRouteNumber(chartRequest.value.routeNumber)
        break
      }
      case 'COMPARE_STOPS_BAR': {
        const ui = useUiStore()
        ui.setChartsVisible(true)
        compareStops.value = {
          a: String(payload?.stopA || compareStops.value.a),
          b: String(payload?.stopB || compareStops.value.b)
        }
        break
      }
      case 'TOGGLE_PANELS': {
        const ui = useUiStore()
        if (payload?.chartsVisible !== undefined) ui.setChartsVisible(!!payload.chartsVisible)
        if (payload?.metricsVisible !== undefined) ui.setMetricsVisible(!!payload.metricsVisible)
        break
      }
      default:
        break
    }
  }

  function resetMapFilters() {
    mapVehicleType.value = 'all'
    regionPreset.value = 'all'
    delayGreaterThan.value = null
  }

  return {
    mapVehicleType,
    regionPreset,
    delayGreaterThan,
    chartRequest,
    compareStops,
    applyCommand,
    resetMapFilters
  }
})
