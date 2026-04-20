<script setup>
import { onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const props = defineProps({
  vehicles: { type: Array, default: () => [] },
  revision: { type: Number, default: 0 },
  highlightDelayOnly: { type: Boolean, default: false },
})

const elRef = shallowRef(null)
/** @type {import('leaflet').Map | null} */
let map = null
/** @type {L.MarkerClusterGroup | null} */
let cluster = null
/** @type {Map<string, L.Marker>} */
const markers = new Map()
/** @type {Map<string, { type: string; lateTag: boolean }>} */
const markerMeta = new Map()

function iconFor(type, emphasizeLate, isLate) {
  const base =
    type === 'tram' ? '#f59e0b' : type === 'trolleybus' ? '#22c55e' : '#38bdf8'
  const ring =
    emphasizeLate && isLate ? '0 0 0 3px #ef444488' : '0 0 0 1px #00000022'
  const emoji = type === 'tram' ? '🚋' : type === 'trolleybus' ? '🚎' : '🚌'
  const html = `<div style="font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;background:${base};box-shadow:${ring}">${emoji}</div>`
  return L.divIcon({
    html,
    className: 'td-marker',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  })
}

function ensureMap() {
  if (map || !elRef.value) return
  map = L.map(elRef.value).setView([55.751244, 37.618423], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  cluster = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 48,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  })
  map.addLayer(cluster)
}

function popupHtml(v) {
  const delay = Number(v.delayMin ?? 0)
  const delayStr = `${delay >= 0 ? '+' : ''}${delay} мин`
  return `
    <div style="font-size:12px;min-width:140px;color:#111">
      <div><strong>${v.type}</strong> · №${v.fleetNumber}</div>
      <div>Маршрут ${v.routeNumber}</div>
      <div>Задержка ${delayStr}</div>
      <div>Скорость ${v.speedKmh ?? '—'} км/ч</div>
    </div>`
}

function syncMarkers(list) {
  ensureMap()
  if (!cluster || !map) return

  const incoming = new Set()

  for (const v of list || []) {
    incoming.add(v.id)

    const late = Number(v.delayMin ?? 0) > 5
    const lateTag = props.highlightDelayOnly ? late : late
    const meta = markerMeta.get(v.id)
    const iconChanged =
      !meta || meta.type !== v.type || meta.lateTag !== lateTag || meta.emphasis !== props.highlightDelayOnly

    let mk = markers.get(v.id)
    const latlng = L.latLng(v.lat, v.lng)

    if (!mk) {
      mk = L.marker(latlng, {
        icon: iconFor(v.type, props.highlightDelayOnly, late)
      })
      mk.bindPopup(popupHtml(v))
      cluster.addLayer(mk)
      markers.set(v.id, mk)
      markerMeta.set(v.id, {
        type: v.type,
        lateTag,
        emphasis: props.highlightDelayOnly
      })
    } else {
      mk.setLatLng(latlng)
      if (iconChanged) {
        mk.setIcon(iconFor(v.type, props.highlightDelayOnly, late))
        markerMeta.set(v.id, {
          type: v.type,
          lateTag,
          emphasis: props.highlightDelayOnly
        })
      }
      mk.setPopupContent(popupHtml(v))
    }

    if (props.highlightDelayOnly && Number(v.delayMin ?? 0) <= 5) {
      mk.setOpacity(0.22)
    } else {
      mk.setOpacity(1)
    }
  }

  for (const [id, mk] of markers) {
    if (!incoming.has(id)) {
      cluster.removeLayer(mk)
      markers.delete(id)
      markerMeta.delete(id)
    }
  }
}

watch(
  () => [props.revision, props.vehicles, props.highlightDelayOnly],
  () => syncMarkers(props.vehicles),
  { deep: false }
)

onMounted(() => {
  ensureMap()
  syncMarkers(props.vehicles)
})

onBeforeUnmount(() => {
  markers.clear()
  markerMeta.clear()
  if (map) {
    map.remove()
    map = null
    cluster = null
  }
})
</script>

<template>
  <div ref="elRef" class="map-root" aria-label="Карта транспорта" />
</template>

<style scoped>
.map-root {
  width: 100%;
  height: 100%;
  min-height: 420px;
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}
</style>
