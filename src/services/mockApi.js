import { useParkingMapStore } from '../stores/parkingMapStore'

let timer = null

/**
 * Симулирует датчики: каждые 10 с меняет статус 1–2 случайных мест (не трогает reserved).
 */
export function startSensorSimulation() {
  try {
    if (localStorage.getItem('E2E') === '1') return
  } catch {
    /* ignore */
  }
  stopSensorSimulation()
  const parking = useParkingMapStore()

  timer = window.setInterval(() => {
    const changeable = parking.spots.filter((s) => s.status !== 'reserved' && !s.inactive)
    if (!changeable.length) return
    const n = Math.random() < 0.5 ? 1 : 2
    const picks = new Set()
    while (picks.size < n && picks.size < changeable.length) {
      const s = changeable[Math.floor(Math.random() * changeable.length)]
      picks.add(s.id)
    }
    for (const id of picks) {
      const spot = parking.spots.find((x) => x.id === id)
      if (!spot || spot.status === 'reserved' || spot.inactive) continue
      const next =
        spot.status === 'free'
          ? Math.random() < 0.55
            ? 'occupied'
            : 'free'
          : Math.random() < 0.45
            ? 'free'
            : 'occupied'
      parking.updateSpotStatus(id, next)
    }
  }, 10_000)
}

export function stopSensorSimulation() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
