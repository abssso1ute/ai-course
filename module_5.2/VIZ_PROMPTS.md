# Промпт-анализ — карта и графики

Ниже три самых «тяжёлых» промпта при генерации компонентов и что в них было важно явно указать.

## 1. TransportMap + realtime updates + кластеры

**Промпт (суть):**  
Vue 3 + Leaflet + `leaflet.markercluster`; маркеры обновляются каждую секунду по WebSocket (80–250 объектов); **не пересоздавать** маркеры при каждом тике — обновлять координаты через `setLatLng`; классифицирующие ключи только при смене типа ТС; попап показывает задержку и маршрут.

**Специфические термины:** imperative updates, marker reuse, incremental DOM vs Vue re-render, MarkerClusterGroup, divIcon.

## 2. График временного ряда загрузки маршрута (Chart.js)

**Промпт:**  
Компонент Line chart: время перестроения при смене `routeNumber`/`days` должно быть коротким (`animation.duration` ограничить); оси и легенда в тёмной теме; данные только из props/store, без мутаций изнутри Chart.

**Термины:** responsive canvas, minimal animation for frequent updates, axis palette for dark UI.

## 3. Столбчатое сравнение двух остановок

**Промпт:**  
Гистограмма на 2 столбца, подписи с длинными кириллическими названиями остановок без обрезки tooltip; палитра различима при дальтонизме не обязательно, но два контрастных цвета и рамки.

**Термины:** categorical axis, datalabel overflow, bounded animation.
