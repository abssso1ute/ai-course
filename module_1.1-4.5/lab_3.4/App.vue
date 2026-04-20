<template>
  <main class="container">
    <h1>Weather Dashboard</h1>
    <p class="subtitle">Прогноз погоды (Open-Meteo)</p>

    <Loader v-if="isLoading" />

    <ErrorAlert
      v-else-if="error"
      :message="error"
      :onRetry="() => loadWeather(true)"
    />

    <div v-else-if="weatherData" class="content">
      <section class="current">
        <h2>Текущая погода</h2>
        <p>Температура: <b>{{ weatherData.current_weather.temperature }}°C</b></p>
        <p>Ветер: <b>{{ weatherData.current_weather.windspeed }} м/с</b></p>

        <button class="refresh-btn" @click="loadWeather(true)">
          Обновить данные
        </button>
      </section>

      <section class="forecast">
        <h2>Прогноз на 3 дня</h2>

        <div class="cards">
          <WeatherCard
            v-for="(day, index) in weatherData.daily.time"
            :key="day"
            :date="day"
            :maxTemp="weatherData.daily.temperature_2m_max[index]"
            :minTemp="weatherData.daily.temperature_2m_min[index]"
            :windSpeed="weatherData.daily.wind_speed_10m_max[index]"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import Loader from "./components/Loader.vue";
import ErrorAlert from "./components/ErrorAlert.vue";
import WeatherCard from "./components/WeatherCard.vue";

import { useWeatherApi } from "./useWeatherApi";

const { weatherData, isLoading, error, loadWeather } = useWeatherApi();

loadWeather();
</script>

<style>
.container {
  max-width: 950px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.subtitle {
  color: #666;
  margin-bottom: 18px;
}

.current {
  background: #f3f3f3;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.refresh-btn {
  margin-top: 12px;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: #333;
  color: white;
  cursor: pointer;
}

.refresh-btn:hover {
  background: #555;
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 768px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>