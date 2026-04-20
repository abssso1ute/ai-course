import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRealtimeStore = defineStore('realtime', () => {
  const vehicles = ref([])
  const revision = ref(0)
  const connected = ref(false)
  const lastError = ref(null)

  function applySnapshot(list) {
    vehicles.value = Array.isArray(list) ? list : []
    revision.value += 1
  }

  function setConnected(v) {
    connected.value = !!v
  }

  function setError(msg) {
    lastError.value = msg ? String(msg) : null
  }

  return {
    vehicles,
    revision,
    connected,
    lastError,
    applySnapshot,
    setConnected,
    setError
  }
})
