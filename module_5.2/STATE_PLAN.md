# План состояния приложения (Pinia)

## `realtimeStore`

| Поле | Тип | Назначение |
|------|-----|------------|
| `vehicles` | `Array<Vehicle>` | Последний снимок ТС с сервера |
| `revision` | `number` | Счётчик версии для «лёгких» watch без глубокого обхода |
| `connected` | `boolean` | Статус WebSocket |
| `lastError` | `string \| null` | Ошибка транспорта |

Действия: `applySnapshot`, `setConnected`, `setError`.

## `uiStore`

| Поле | Назначение |
|------|------------|
| `role` | `'dispatcher' \| 'analyst'` |
| `chartsVisible` | Показывать ли блок графиков |
| `metricsVisible` | Показывать ли KPI-панель |
| `selectedRouteNumber` | Выбранный маршрут для графиков |

## `dashboardStore` (командный центр для чата)

| Поле | Назначение |
|------|------------|
| `mapVehicleType` | `'all' \| 'bus' \| 'trolleybus' \| 'tram'` |
| `regionPreset` | `'all' \| 'nw' \| 'ne' \| 'sw' \| 'se'` — фильтр сектора города |
| `delayGreaterThan` | Порог опоздания для подсветки / отчёта (`null` = выкл.) |
| `chartRequest` | Последний запрос на график: тип, маршрут, диапазон времени |
| `compareStops` | Два названия остановок для столбчатого сравнения |

Действия: `applyCommand(cmd)`, сброс фильтров.

## `chatStore`

| Поле | Назначение |
|------|------------|
| `messages` | История диалога |
| `pendingCommand` | Последняя команда для отладки (опционально) |

Поток: пользователь отправляет текст → `transportAnalystAgent` → `dashboardStore` + ответ в `chatStore`.
