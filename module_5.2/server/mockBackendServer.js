/**
 * Мок-сервер: движение 50–100+ ТС по маршрутам, REST, WebSocket /stream
 * Запуск: node server/mockBackendServer.js
 */
import http from 'node:http'
import express from 'express'
import { WebSocketServer } from 'ws'

const PORT = Number(process.env.PORT || 3333)
const CENTER = { lat: 55.751244, lng: 37.618423 }

const ROUTE_SHAPES = [
  polyline(
    CENTER,
    [
      [0, 0],
      [0.04, 0.01],
      [0.08, 0.02],
      [0.1, 0.05]
    ],
    12
  ),
  polyline(
    CENTER,
    [
      [0, 0],
      [-0.05, 0.04],
      [-0.1, 0.08]
    ],
    12
  ),
  polyline(
    CENTER,
    [
      [0, 0],
      [0.02, -0.06],
      [0.04, -0.1]
    ],
    12
  ),
  polyline(
    CENTER,
    [
      [0, 0],
      [0.06, 0.06],
      [0.1, 0.1]
    ],
    10
  ),
  polyline(
    CENTER,
    [
      [0, 0],
      [-0.04, -0.02],
      [-0.08, -0.04]
    ],
    10
  ),
  polyline(
    CENTER,
    [
      [0, 0],
      [0.02, 0.08],
      [0.04, 0.12]
    ],
    10
  ),
  polyline(
    CENTER,
    [
      [0, 0],
      [-0.06, 0.02],
      [-0.1, 0.04]
    ],
    10
  ),
  polyline(
    CENTER,
    [
      [0, 0],
      [0.05, -0.03],
      [0.09, -0.06]
    ],
    10
  )
]

const ROUTES_META = [
  { id: 'r555', number: '555', name: 'Центр — СЗ' },
  { id: 'r33', number: '33', name: 'Диагональ' },
  { id: 'r725', number: '725', name: 'Юг — Восток' },
  { id: 'r12', number: '12', name: 'Кольцо А' },
  { id: 'r48', number: '48', name: 'Кольцо Б' },
  { id: 'r151', number: '151', name: 'Магистраль' },
  { id: 'r904', number: '904', name: 'Экспресс' },
  { id: 'r281', number: '281', name: 'Радиус' }
]

function polyline(center, deltas, segments) {
  const pts = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const lat =
      center.lat +
      deltas[0][0] * t +
      (deltas[1] ? (deltas[1][0] - deltas[0][0]) * t * t : 0)
    const lng =
      center.lng +
      deltas[0][1] * t +
      (deltas[1] ? (deltas[1][1] - deltas[0][1]) * t * t : 0)
    pts.push([lat, lng])
  }
  return pts
}

function positionOnPolyline(points, t) {
  const n = points.length - 1
  const x = ((t % 1) + 1) % 1
  const seg = Math.min(n - 1, Math.floor(x * n))
  const local = x * n - seg
  const [a0, a1] = points[seg]
  const [b0, b1] = points[seg + 1]
  const lat = a0 + (b0 - a0) * local
  const lng = a1 + (b1 - a1) * local
  const dlat = b0 - a0
  const dlng = b1 - a1
  const bearing = (Math.atan2(dlng, dlat) * 180) / Math.PI
  return { lat, lng, bearing }
}

function randomType(i) {
  const r = i % 10
  if (r < 5) return 'bus'
  if (r < 8) return 'trolleybus'
  return 'tram'
}

function buildFleet(size) {
  const fleet = []
  for (let i = 0; i < size; i++) {
    const rm = ROUTES_META[i % ROUTES_META.length]
    const pts = ROUTE_SHAPES[i % ROUTE_SHAPES.length]
    fleet.push({
      id: `v-${i + 1}`,
      fleetNumber: String(1000 + i),
      routeId: rm.id,
      routeNumber: rm.number,
      routeName: rm.name,
      type: randomType(i),
      t: (i * 0.073) % 1,
      speed: 0.004 + (i % 7) * 0.0003,
      delayMin: Math.round(Math.sin(i) * 6),
      occupancy: 0.35 + ((i * 17) % 55) / 100
    })
    fleet[fleet.length - 1]._points = pts
  }
  return fleet
}

function tickFleet(fleet) {
  return fleet.map((v) => {
    let delayMin = v.delayMin + (Math.random() - 0.5) * 0.8
    delayMin = Math.max(-15, Math.min(25, Math.round(delayMin)))
    let t = v.t + v.speed * (0.85 + Math.random() * 0.25)
    if (t >= 1) t -= 1
    const { lat, lng, bearing } = positionOnPolyline(v._points, t)
    const speedKmh = 18 + Math.abs(20 - delayMin) * 0.6
    return {
      ...v,
      lat,
      lng,
      bearingDeg: bearing,
      delayMin,
      speedKmh: Math.round(speedKmh),
      occupancy: Math.min(1, Math.max(0.05, v.occupancy + (Math.random() - 0.5) * 0.03)),
      t
    }
  })
}

function vehiclesSnapshot(fleet) {
  return fleet.map(({ _points, t, speed, ...rest }) => rest)
}

function stopsCatalog() {
  return [
    { id: 's1', name: 'Университет', lat: 55.7039, lng: 37.5287 },
    { id: 's2', name: 'Парк Культуры', lat: 55.7358, lng: 37.595 },
    { id: 's3', name: 'Тверская', lat: 55.7653, lng: 37.6036 },
    { id: 's4', name: 'Курский вокзал', lat: 55.7588, lng: 37.6616 }
  ]
}

function syntheticRouteHistory(routeNumber, days) {
  const labels = []
  const loads = []
  const n = Math.min(56, Math.max(7, days))
  const base = 40 + Number(routeNumber) % 17
  for (let i = 0; i < n; i++) {
    labels.push(`Д${i + 1}`)
    loads.push(Math.round(base + Math.sin(i / 3) * 12 + (Math.random() - 0.5) * 6))
  }
  return { labels, loads, routeNumber, days }
}

function syntheticStopCompare(nameA, nameB) {
  const a =
    Math.round(
      120 + Math.sin((nameA || '').length + 3) * 40 + Number((nameA || '')[0]?.charCodeAt(0) || 7) % 17
    )
  const b =
    Math.round(
      110 + Math.cos((nameB || '').length + 1) * 35 + Number((nameB || '')[0]?.charCodeAt(0) || 5) % 19
    )
  return { labels: [nameA || 'А', nameB || 'Б'], values: [a, b] }
}

const app = express()
app.use(express.json())

let fleet = tickFleet(buildFleet(88))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/routes', (_req, res) => {
  res.json({ routes: ROUTES_META })
})

app.get('/api/stops', (_req, res) => {
  res.json({ stops: stopsCatalog() })
})

app.get('/api/vehicles', (req, res) => {
  const { count } = req.query
  if (count && Number(count) !== fleet.length) {
    fleet = tickFleet(buildFleet(Math.min(400, Math.max(20, Number(count)))))
  }
  res.json({ vehicles: vehiclesSnapshot(fleet) })
})

app.get('/api/history/route/:routeNumber', (req, res) => {
  const days = Number(req.query.days || 7)
  res.json(syntheticRouteHistory(req.params.routeNumber, days))
})

app.get('/api/stops/compare', (req, res) => {
  const nameA = String(req.query.nameA || 'Университет')
  const nameB = String(req.query.nameB || 'Парк Культуры')
  res.json(syntheticStopCompare(nameA, nameB))
})

const server = http.createServer(app)
const wss = new WebSocketServer({ server, path: '/stream' })

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'hello', message: 'mock transport stream' }))
})

setInterval(() => {
  fleet = tickFleet(fleet)
  const snapshot = vehiclesSnapshot(fleet)
  const msg = JSON.stringify({ type: 'tick', vehicles: snapshot })
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(msg)
  }
}, 1000)

server.listen(PORT, () => {
  console.log(`mockBackendServer listening on http://127.0.0.1:${PORT} (WS /stream)`)
})
