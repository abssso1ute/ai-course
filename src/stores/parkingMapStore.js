import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const ROWS = 8
const COLS = 12

function isE2EMode() {
  try {
    return localStorage.getItem('E2E') === '1'
  } catch {
    return false
  }
}

function buildInitialSpots(basePrice) {
  const spots = []
  let sensor = 1
  const center = { row: ROWS / 2, col: COLS / 2 }
  const e2e = isE2EMode()
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const id = `S-${row}-${col}`
      const dist = Math.abs(row - center.row) + Math.abs(col - center.col)
      const price = Math.round(basePrice + dist * 5 + (col % 3) * 3)
      let status = 'free'
      if (e2e) {
        if (row === 0 && col === 0) status = 'occupied'
      } else {
        const roll = Math.random()
        if (roll < 0.35) status = 'occupied'
        else if (roll < 0.42) status = 'reserved'
      }
      const entranceId = col < COLS / 3 ? 1 : col < (2 * COLS) / 3 ? 2 : 3
      spots.push({
        id,
        coordinates: { row, col },
        status,
        price,
        sensorId: `sensor-${sensor}`,
        entranceId,
        inactive: false
      })
      sensor += 1
    }
  }
  return spots
}

export const useParkingMapStore = defineStore('parkingMap', () => {
  const basePricePerHour = ref(80)
  const spots = ref(buildInitialSpots(basePricePerHour.value))
  const highlightedSpotId = ref(null)

  const entrances = ref([
    { id: 1, label: 'Вход №1', anchor: { row: 3, col: 0 } },
    { id: 2, label: 'Вход №2', anchor: { row: 3, col: Math.floor(COLS / 2) } },
    { id: 3, label: 'Вход №3', anchor: { row: 3, col: COLS - 1 } }
  ])

  const freeSpots = computed(() =>
    spots.value.filter((s) => s.status === 'free' && !s.inactive)
  )

  function manhattan(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
  }

  function findEntrance(entranceId) {
    return entrances.value.find((e) => e.id === Number(entranceId))
  }

  function findClosestSpot(entranceId) {
    const entrance = findEntrance(entranceId)
    if (!entrance) return null
    const candidates = spots.value.filter((s) => s.status === 'free' && !s.inactive)
    if (!candidates.length) return null
    let best = candidates[0]
    let bestD = manhattan(best.coordinates, entrance.anchor)
    for (const s of candidates) {
      const d = manhattan(s.coordinates, entrance.anchor)
      if (d < bestD) {
        best = s
        bestD = d
      }
    }
    return best
  }

  function findCheapestFree() {
    const candidates = spots.value.filter((s) => s.status === 'free' && !s.inactive)
    if (!candidates.length) return null
    return candidates.reduce((a, b) => (a.price <= b.price ? a : b))
  }

  function setHighlightedSpotId(id) {
    highlightedSpotId.value = id
  }

  function updateSpotStatus(spotId, status) {
    const spot = spots.value.find((s) => s.id === spotId)
    if (spot && spot.status !== 'reserved' && !spot.inactive) {
      spot.status = status
    }
  }

  function reserveSpot(spotId) {
    const spot = spots.value.find((s) => s.id === spotId)
    if (!spot || spot.status !== 'free' || spot.inactive) return false
    spot.status = 'reserved'
    return true
  }

  function releaseSpot(spotId) {
    const spot = spots.value.find((s) => s.id === spotId)
    if (!spot) return false
    if (spot.status === 'reserved') spot.status = 'free'
    return true
  }

  function setBasePrice(v) {
    const n = Number(v)
    if (!Number.isFinite(n) || n < 0) return
    basePricePerHour.value = n
    spots.value = spots.value.map((s) => {
      const dist =
        Math.abs(s.coordinates.row - ROWS / 2) + Math.abs(s.coordinates.col - COLS / 2)
      return {
        ...s,
        price: Math.round(n + dist * 5 + (s.coordinates.col % 3) * 3),
        inactive: !!s.inactive
      }
    })
  }

  function addSpot() {
    const inactive = spots.value.filter((s) => s.inactive)
    if (!inactive.length) return null
    const spot = inactive[Math.floor(Math.random() * inactive.length)]
    spot.inactive = false
    spot.status = 'free'
    return spot.id
  }

  function removeRandomFreeSpot() {
    const free = spots.value.filter((s) => s.status === 'free' && !s.inactive)
    if (!free.length) return null
    const spot = free[Math.floor(Math.random() * free.length)]
    spot.inactive = true
    spot.status = 'free'
    if (highlightedSpotId.value === spot.id) highlightedSpotId.value = null
    return spot.id
  }

  function stats() {
    const active = spots.value.filter((s) => !s.inactive)
    const total = active.length
    const occupied = active.filter((s) => s.status === 'occupied').length
    const reserved = active.filter((s) => s.status === 'reserved').length
    const free = active.filter((s) => s.status === 'free').length
    return {
      total,
      occupied,
      reserved,
      free,
      load: total ? Math.round(((occupied + reserved) / total) * 100) : 0
    }
  }

  return {
    ROWS,
    COLS,
    spots,
    entrances,
    highlightedSpotId,
    basePricePerHour,
    freeSpots,
    findClosestSpot,
    findCheapestFree,
    setHighlightedSpotId,
    updateSpotStatus,
    reserveSpot,
    releaseSpot,
    setBasePrice,
    addSpot,
    removeRandomFreeSpot,
    stats
  }
})
