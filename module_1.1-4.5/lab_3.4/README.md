# Weather Dashboard (Open-Meteo)

Небольшое SPA-приложение для отображения текущей погоды и прогноза на 3 дня.  
Данные берутся из публичного API Open-Meteo.

## Возможности
- Текущая температура и скорость ветра
- Прогноз на 3 дня (max/min температура + ветер)
- Loader во время загрузки
- Error UI с кнопкой "Повторить"
- Кэширование ответа API в localStorage на 5 минут

## Используемое API
Open-Meteo Forecast API  
https://open-meteo.com/

Пример запроса:
https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max&current_weather=true&timezone=auto&forecast_days=3

## Запуск проекта локально

1) Установить зависимости:
```bash
npm install