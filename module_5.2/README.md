# Транспортный дашборд — модуль 5.2 (Stepik)

Оперативная карта с WebSocket-потоком, KPI, графиками (Chart.js) и чат-агентом, который выдаёт **структурированные команды** в Pinia-сторы (`dashboardStore`, `uiStore`).

## Быстрый старт

Требуется Node.js 18+.

```bash
cd module_5.2
npm install
```

В **двух терминалах**:

```bash
npm run server
```

```bash
npm run dev
```

Либо одной командой:

```bash
npm run dev:full
```

Откройте `http://127.0.0.1:5173`. Мок API и WebSocket: `http://127.0.0.1:3333` (`/api/*`, `WS /stream`).

Проверка «200+ маркеров»: после запуска сервера откройте в браузере или через curl снимок:

`GET http://127.0.0.1:3333/api/vehicles?count=250`

## Структура артефактов курса


| Файл / папка                                     | Назначение                                  |
| ------------------------------------------------ | ------------------------------------------- |
| `DOMAIN_ANALYSIS.md`                             | Предметная область и сущности               |
| `TECH_SPEC.md`                                   | User stories и требования                   |
| `ARCHITECTURE.md`                                | Mermaid-схемы и поток «агент → стор → UI»   |
| `STATE_PLAN.md`                                  | Описание Pinia-сторов                       |
| `VIZ_PROMPTS.md`                                 | Сложные промпты для карты/графиков          |
| `FINAL_REPORT.md`                                | Итоговый отчёт (экспорт в PDF вручную)      |
| `server/mockBackendServer.js`                    | Мок GTFS-подобных данных, REST + WS         |
| `src/agent/transportAnalystAgent.js`             | Намерение → команды дашборда                |
| `src/components/TransportMap.vue`                | Leaflet + кластеризация маркеров            |


## Деплой (обзор)

- **Фронтенд:** статическая сборка `npm run build` → `dist/` на Vercel или Netlify (`vercel.json` в корне модуля — SPA fallback).
- **Бэкенд моков:** `server/mockBackendServer.js` на Render/Railway/Fly (порт из `PORT`, WS путь `/stream`).
- На проде задайте `VITE_WS_URL=wss://<ваш-хост>/stream` при сборке фронта, чтобы клиент подключался к удалённому потоку.

## Ссылки проекта

- Видео-демо: [Transport dashboard demo.mov](https://drive.google.com/file/d/1CKmJxF5srAnIxAEBUMhHoTXAugmUY_G0/view?usp=drive_link)

## Экспорт PDF из `FINAL_REPORT.md`

Любой редактор Markdown → PDF (VS Code Markdown PDF, Typora, Pandoc и т.д.).