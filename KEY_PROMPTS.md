# Ключевые промпты (этап 1) — предварительный список 5–7

Ниже — заготовки для генерации сложных частей системы в ИИ. Их можно копировать в чат с моделью, подставляя стек и ограничения курса.

## 1. Интерактивная карта (SVG/сетка)

> Ты — senior frontend (Vue 3 + Composition API). Сгенерируй компонент `ParkingMap.vue`: входной проп или стор Pinia с массивом мест `{ id, coordinates: {row,col}, status: 'free'|'occupied'|'reserved', price }`. Отрисуй сетку 8×12, цвет по статусу, hover, клик выбирает место. Используй `v-memo` на ячейках при частых обновлениях. Без внешних UI-библиотек.

## 2. Mock API датчиков

> Напиши `mockApi.js` для Vite/Vue: каждые 10 секунд случайно выбрать 1–2 `spotId` и изменить `status` на свободно/занято с весами; экспорт `startSensorSimulation(parkingMapStore)` и `stopSensorSimulation`. Не использовать реальный бэкенд.

## 3. Сервис намерений (клиент)

> Реализуй `agentCore.js`: функция `analyzeIntent(text: string)` возвращает JSON `{ intent: 'find'|'book'|'cancel'|'where'|'cheapest'|'unknown', params }`. Распознай русские фразы: «вход 3», «на 2 часа», «с 15:00», «дешевле», «отмени», «где бронь». Только эвристики/регулярки, без вызова LLM.

## 4. Оркестратор чата

> Напиши `handleUserRequest(message)` в Vue 3 проекте: вызов `analyzeIntent`, затем Pinia `parkingMapStore` / `bookingStore` / `chatStore`. После `find` выставить `highlightedSpotId` и `pendingBookSpotId`. Сообщения ассистента — короткие, по-русски.

## 5. E2E Playwright

> Сгенерируй Playwright-тесты для SPA: открыть `/`, ввести в чат «найди место у входа 3», дождаться кнопки «Забронировать», нажать, проверить текст подтверждения и блок «Моё бронирование». Используй `data-testid`.

## 6. Ленивая загрузка админки

> Настрой Vue Router: маршрут `/admin` с динамическим `import()` компонента админ-панели; на главной только чанк приложения без админского кода в initial bundle (проверь `manualChunks` при необходимости).

## 7. Service Worker / офлайн-оболочка

> Добавь `public/sw.js` с прекэшем `/`, `/index.html`, `/favicon.svg` и стратегией: сначала `caches.match`, иначе `fetch`, при ошибке — `index.html`. В `main.js` регистрируй SW только в production (`import.meta.env.PROD`). В корневом `App.vue` покажи баннер при `offline` через `navigator.onLine` и события `online`/`offline`.
