# Архитектура системы

## Компоненты

```mermaid
flowchart LR
  subgraph client["Клиент SPA"]
    UI["Карта / графики / KPI"]
    Chat["Чат-виджет"]
    Stores["Pinia: realtime / ui / dashboard"]
  end

  subgraph app["Сервер приложений Node.js"]
    API["REST API агрегации"]
    WS["WebSocket поток позиций"]
    Agent["Опционально POST /api/agent"]
  end

  subgraph data["Источники данных"]
    Mock["mockBackendServer: симулятор GTFS-подобных данных"]
    Hist["Синтетическая история в памяти"]
  end

  Chat -->|"команды"| Stores
  Agent -->|"те же команды"| Stores
  UI --> Stores
  Stores -->|"fetch"| API
  WS -->|"события позиций"| client
  API --> Mock
  API --> Hist
  Mock --> WS
```

## Поток: чат → дашборд

```mermaid
sequenceDiagram
  participant U as Пользователь
  participant A as transportAnalystAgent
  participant D as dashboardStore
  participant V as TransportMap / Charts

  U->>A: текст запроса
  A->>A: Intent + entities
  A->>D: structured command
  D->>V: реактивное состояние
  V->>V: обновление карты / графиков
  A->>U: текстовый отчёт
```

## Связь бота и визуализации

1. Агент **не** рисует карту сам: он только эмитит команды (`UPDATE_MAP_FILTER`, `FETCH_AND_RENDER_CHART`, …).
2. Компоненты подписаны на **Pinia** (через `storeToRefs` / computed): изменение фильтра или набора данных вызывает точечное обновление.
3. Поток координат идёт мимо LLM: **realtimeStore** обновляется из WebSocket; агент лишь задаёт фильтры и запросы к истории.

## Ответ на вопрос блока 1 (кратко)

**Сложность:** нужно превратить свободный текст в **детерминированные команды состояния** и не смешивать это с потоком низкоуровневых координат — иначе визуализация будет деградировать при частых обновлениях.

**Связь модулей:** чат-агент пишет в **единый dashboard / ui store**; карта и графики только читают store и API. Так визуализация остаётся предсказуемой, а частые realtime-обновления не перезапускают разбор NLP.
