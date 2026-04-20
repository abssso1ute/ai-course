import { useRealtimeStore } from '@/stores/realtimeStore'

function resolveWsUrl() {
  const env = import.meta.env?.VITE_WS_URL
  if (env) return env
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.hostname
  const port = import.meta.env?.DEV ? '3333' : window.location.port || (proto === 'wss:' ? '443' : '80')
  return `${proto}//${host}:${port}/stream`
}

/**
 * Подключение к WebSocket мок-сервера; обновляет realtimeStore снимком ТС.
 * @returns {{ stop: () => void }}
 */
export function connectRealtimeStream() {
  const store = useRealtimeStore()
  let ws
  let stopped = false
  let reconnectTimer

  function connect() {
    if (stopped) return
    const url = resolveWsUrl()
    ws = new WebSocket(url)

    ws.onopen = () => {
      store.setConnected(true)
      store.setError(null)
    }

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg?.type === 'tick' && Array.isArray(msg.vehicles)) {
          store.applySnapshot(msg.vehicles)
        }
      } catch {
        store.setError('Некорректное сообщение WS')
      }
    }

    ws.onclose = () => {
      store.setConnected(false)
      if (!stopped) {
        reconnectTimer = window.setTimeout(connect, 2000)
      }
    }

    ws.onerror = () => {
      store.setError('Ошибка WebSocket')
    }
  }

  connect()

  return {
    stop() {
      stopped = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (ws && ws.readyState === WebSocket.OPEN) ws.close()
    }
  }
}

/** Fallback: периодический REST, если WS недоступен в окружении деплоя */
export async function fetchVehiclesOnce() {
  const store = useRealtimeStore()
  try {
    const res = await fetch('/api/vehicles')
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    store.applySnapshot(data.vehicles || [])
    store.setError(null)
  } catch (e) {
    store.setError(e?.message || 'fetch failed')
  }
}
