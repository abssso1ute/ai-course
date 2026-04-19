# План состояния (State Plan) — Pinia

## 1. `parkingMapStore`

**Назначение:** сетка/карта мест, подсветка выбора, поиск по критериям.

| Поле / геттер | Тип | Описание |
|----------------|-----|----------|
| `spots` | `Spot[]` | Массив мест: `id`, `coordinates: { row, col }`, `status`, `price`, `sensorId`, `entranceId` (ближайший вход). |
| `entrances` | `Entrance[]` | Входы: `id`, `label`, привязка к ряду/колонке для эвристики «рядом с входом». |
| `highlightedSpotId` | `string \| null` | Место, выделенное ассистентом на карте. |
| `basePricePerHour` | `number` | Базовый тариф (админ может менять). |
| **actions** | | `setSpots`, `updateSpotStatus`, `findClosestSpot(entranceId)`, `findCheapestFree()`, `reserveSpot(id)`, `releaseSpot(id)`, `addSpot`, `removeSpot`, `setBasePrice`. |

## 2. `bookingStore`

**Назначение:** одно активное бронирование водителя (MVP).

| Поле | Тип | Описание |
|------|-----|----------|
| `activeBooking` | `Booking \| null` | `spotId`, `start`, `end`, `createdAt`. |
| **actions** | | `createBooking({ spotId, durationHours, startHour })`, `cancelBooking()`. |

## 3. `chatStore`

**Назначение:** история чата и последнее «действие UI» от ассистента.

| Поле | Тип | Описание |
|------|-----|----------|
| `messages` | `ChatMessage[]` | `role: 'user' \| 'assistant'`, `text`, опционально `timestamp`. |
| `pendingBookSpotId` | `string \| null` | Для кнопки «Забронировать» после поиска. |
| **actions** | | `pushUser`, `pushAssistant`, `setPendingBookSpotId`, `clearPendingBook`. |

## 4. Связь с агентом

`handleUserRequest(message)` (оркестратор) **не** является отдельным Pinia-стором: он вызывает `agentCore`, затем методы перечисленных сторов и пишет результат в `chatStore` (+ при необходимости в `parkingMapStore`).
