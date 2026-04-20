# API_SPEC.md — Open-Meteo Weather API (lab_3.4)

## 1. Выбранное API
Я выбрал Open-Meteo API, потому что он бесплатный, быстрый и не требует ключа.

---

## 2. Base URL
https://api.open-meteo.com/v1

---

## 3. Нужен ли API-ключ?
Нет, API-ключ не требуется.

---

## 4. Основной эндпоинт
### Forecast endpoint:
GET /forecast

Полный пример:
https://api.open-meteo.com/v1/forecast

---

## 5. Обязательные параметры
- latitude (например 55.7558)
- longitude (например 37.6173)

---

## 6. Полезные опциональные параметры
- daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max
- current_weather=true
- timezone=auto
- forecast_days=3 (или 7)

Пример запроса:
https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max&current_weather=true&timezone=auto&forecast_days=3

---

## 7. Пример успешного ответа (JSON)
Пример структуры ответа:

{
  "latitude": 55.75,
  "longitude": 37.62,
  "timezone": "Europe/Moscow",
  "current_weather": {
    "temperature": 18.5,
    "windspeed": 4.2,
    "weathercode": 3
  },
  "daily": {
    "time": ["2026-04-18", "2026-04-19"],
    "temperature_2m_max": [20.1, 21.3],
    "temperature_2m_min": [10.2, 11.1],
    "wind_speed_10m_max": [5.1, 6.2]
  }
}

---

## 8. Интересные поля
- current_weather.temperature — текущая температура
- current_weather.windspeed — скорость ветра
- daily.time — даты прогноза
- daily.temperature_2m_max / min — максимальная и минимальная температура по дням
- daily.wind_speed_10m_max — максимальный ветер по дням

---

## 9. Ограничения (rate limits)
Официально API бесплатное и рассчитано на демо/обычные проекты.
Для учебной работы и небольшого приложения лимитов более чем достаточно.

---

# Проектирование приложения

## 1. Цель приложения
Сделать мини-приложение "Weather Dashboard", которое показывает:
- текущую погоду
- прогноз на 3 дня (макс/мин температура + ветер)

Город: Москва (координаты можно захардкодить или сделать выбор позже).

---

## 2. Структура компонентов (React/Vue)
- App (главный компонент)
- WeatherWidget (контейнер с запросом и логикой)
- WeatherCard (карточка дня)
- Loader (индикатор загрузки)
- ErrorAlert (сообщение об ошибке)

---

## 3. Состояние (state)
- weatherData: object | null
- isLoading: boolean
- error: string | null

---

## 4. Логика работы приложения
1) Пользователь открывает страницу
2) Показывается Loader
3) Отправляется запрос на Open-Meteo API
4) Если успех → отображается прогноз и текущая погода
5) Если ошибка → отображается ErrorAlert
6) Данные форматируются в удобный вид (даты + температуры)

---

## 5. Дополнительно (идея улучшения)
Можно добавить выбор города через select или поиск, но для демо достаточно фиксированных координат.