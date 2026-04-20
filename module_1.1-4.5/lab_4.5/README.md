# Лабораторная 4.5 — чат с LLM через безопасный прокси

## Структура

- `CHAT_ARCHITECTURE.md` — компоненты и поток данных, риски ключа в браузере.
- `chat-backend/` — Express + OpenAI streaming (`npm start`, порт `3000`).
- `frontend/ChatWidget.jsx` — React-виджет (SSE, история, «Новый диалог»).
- `FINAL_CHAT_REPORT.md` — отчёт и промпты для Stepik.

Подключите `ChatWidget` в корне вашего SPA: `import ChatWidget from "./path/to/ChatWidget.jsx"` и `<ChatWidget />`.

Устаревшие дубли `server.js` в корне `lab_4.5` не используйте — эталон **`chat-backend/server.js`**.
