# Руководство по развёртыванию

## 1. Фронтенд (Vercel или Netlify)

Проект — статический SPA после `vite build` (папка `dist/`).

### Vercel

1. Создайте репозиторий на [GitVerse](https://gitverse.ru) и запушьте проект.
2. В [Vercel](https://vercel.com) импортируйте репозиторий.
3. Настройки сборки:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. Деплой. Для SPA добавьте `vercel.json` с rewrites на `index.html` (см. ниже).

### Netlify

1. New site from Git → выберите репозиторий.
2. Build: `npm run build`, publish: `dist`.
3. Добавьте `_redirects` в `public/`:

```
/*    /index.html   200
```

Netlify скопирует `public/*` в `dist` при сборке Vite.

### `vercel.json` (опционально)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 2. Service Worker

`public/sw.js` копируется в корень `dist`. Регистрация в `src/main.js` только при `import.meta.env.PROD`.

После первого деплоя откройте сайт **дважды** или подождите активации SW; для проверки: DevTools → Application → Service Workers.

## 3. Бэкенд / LLM-прокси (опционально)

В текущем MVP **нет** серверного кода: намерения на клиенте. Если добавите OpenAI:

1. Поднимите минимальный Node/Express на [Render](https://render.com) или [Railway](https://railway.app).
2. Храните `OPENAI_API_KEY` в переменных окружения сервера, **не** в фронтенде.
3. Фронтенд вызывает только ваш прокси (`POST /assistant`).

## 4. Переменные окружения

Для MVP не требуются. При добавлении API:

```env
VITE_ASSISTANT_URL=https://your-proxy.example.com
```

## 5. Проверка после деплоя

- Главная, карта, чат, бронь.
- `/admin` открывается отдельным чанком (Network → JS).
- Lighthouse (см. `lighthouse/README.md`).
