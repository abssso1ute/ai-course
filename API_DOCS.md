# API документация (внутренние модули)

Все вызовы выполняются в браузере (MVP без реального бэкенда).

## `src/stores/parkingMapStore.js`

| Член | Описание |
|------|----------|
| `spots` | `ref(Spot[])` — ячейки с полями `id`, `coordinates`, `status`, `price`, `sensorId`, `entranceId`, `inactive`. |
| `entrances` | Список входов с `anchor` для поиска «рядом с входом». |
| `highlightedSpotId` | Подсветка на карте (ассистент / сценарий «где бронь»). |
| `basePricePerHour` | Базовая ставка; `setBasePrice(n)` пересчитывает цены. |
| `freeSpots` | Геттер: `status === 'free' && !inactive`. |
| `findClosestSpot(entranceId)` | Ближайшее свободное место по Манхэттену к якорю входа. |
| `findCheapestFree()` | Свободное место с минимальной ценой. |
| `updateSpotStatus(id, status)` | Обновление для мок-датчиков (`reserved` не трогается). |
| `reserveSpot(id)` | `free` → `reserved`, иначе `false`. |
| `releaseSpot(id)` | `reserved` → `free`. |
| `addSpot()` / `removeRandomFreeSpot()` | Админ: вернуть неактивную ячейку / снять свободную с продажи. |
| `stats()` | `{ total, occupied, reserved, free, load }` по активным ячейкам. |

## `src/stores/bookingStore.js`

| Член | Описание |
|------|----------|
| `activeBooking` | Одно активное бронирование или `null`. |
| `createBooking({ spotId, durationHours, startHour })` | Создаёт интервал; `startHour` опционален (число 0–23). |
| `cancelBooking()` | Обнуляет бронь. |

## `src/stores/chatStore.js`

| Член | Описание |
|------|----------|
| `messages` | Массив `{ role, text, ts }`. |
| `pendingBookSpotId` | ID места для кнопки «Забронировать». |
| `pushUser` / `pushAssistant` | Добавить сообщение. |
| `setPendingBookSpotId` / `clearPendingBook` | Управление CTA после поиска. |

## `src/agent/agentCore.js`

```ts
analyzeIntent(text: string): {
  intent: 'find' | 'book' | 'cancel' | 'where' | 'cheapest' | 'unknown'
  params: { entranceId?, durationHours?, startHour? }
}
```

Русскоязычные эвристики и регулярные выражения, **без** внешней LLM.

## `src/agent/handleUserRequest.js`

```ts
handleUserRequest(message: string): void
```

1. `analyzeIntent`  
2. Мутации `parkingMapStore` / `bookingStore`  
3. Ответы в `chatStore.pushAssistant`

## `src/services/mockApi.js`

```ts
startSensorSimulation(): void
stopSensorSimulation(): void
```

Интервал **10 с**, 1–2 случайных места. В режиме `localStorage.E2E=1` не запускается.

## `public/sw.js`

События `install` / `activate` / `fetch`: прекэш `/`, `/index.html`, `/favicon.svg`, далее cache-first с запасным `index.html`.
