# Архитектура Smart Parking (ARCHITECTURE)

Ниже — диаграмма в формате Mermaid (требование задания: `ARCHITECTURE.md` с Mermaid).

## 1. Компоненты и потоки

```mermaid
flowchart TB
  subgraph Client["Браузер (SPA Vue 3)"]
    UI["UI: ParkingMap, ChatWidget, Views"]
    Pinia["Pinia: parkingMapStore, bookingStore, chatStore"]
    Agent["agentCore.js + handleUserRequest"]
    UI <--> Pinia
    UI --> Agent
    Agent --> Pinia
  end

  subgraph Mock["Мок-бэкенд (в браузере)"]
    MockAPI["mockApi.js — симуляция датчиков"]
  end

  subgraph Optional["Опционально: внешняя LLM"]
    LLMProxy["LLM-прокси (Render/Railway)"]
    OpenAI["OpenAI / др. провайдер"]
    LLMProxy --> OpenAI
  end

  MockAPI -->|"setInterval 10s: обновление статусов"| Pinia
  Agent -.->|"будущее: NLU/уточнения"| LLMProxy
  Pinia -->|"read/write"| UI
```

## 2. Поток данных: запрос к ассистенту

```mermaid
sequenceDiagram
  participant U as Пользователь
  participant C as ChatWidget
  participant H as handleUserRequest
  participant A as agentCore
  participant P as parkingMapStore
  participant B as bookingStore
  participant CH as chatStore

  U->>C: Текст сообщения
  C->>H: handleUserRequest(message)
  H->>A: analyzeIntent(message)
  A-->>H: { intent, params }
  alt intent = find / cheapest
    H->>P: findClosestSpot / findCheapestFree
    P-->>H: spot | null
    H->>P: setHighlightedSpotId
  else intent = book
    H->>B: createBooking(...)
    H->>P: reserveSpot
  else intent = cancel
    H->>B: cancelBooking()
    H->>P: releaseSpot
  end
  H->>CH: appendAssistantMessage + actions
  CH-->>C: Обновление UI
```

## 3. Пояснения

- **Фронтенд** — единственный исполняемый UI; состояние централизовано в Pinia.
- **Мок** — имитация датчиков без реального IoT; в проде заменяется на WebSocket/REST.
- **LLM-прокси** — в учебном MVP намерения разбираются **на клиенте** (`agentCore.js`); прокси зарезервирован для расширений (сложный NLU, мультиязычность).

## 4. PNG

При необходимости экспорта в PNG: откройте диаграмму в [Mermaid Live Editor](https://mermaid.live) и сохраните как `ARCHITECTURE.png` в корень репозитория.
