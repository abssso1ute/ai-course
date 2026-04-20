import { ref } from "vue";
import { fetchWeatherForecast } from "./weatherService";

const CACHE_KEY = "weather_cache_v1";
const CACHE_TIME = 5 * 60 * 1000; // 5 минут

export function useWeatherApi() {
  const weatherData = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  function getCachedData() {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);

      if (!parsed.timestamp || !parsed.data) return null;

      const isExpired = Date.now() - parsed.timestamp > CACHE_TIME;
      if (isExpired) return null;

      return parsed.data;
    } catch {
      return null;
    }
  }

  function setCachedData(data) {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data
      })
    );
  }

  async function loadWeather(forceReload = false) {
    try {
      isLoading.value = true;
      error.value = null;

      if (!forceReload) {
        const cached = getCachedData();
        if (cached) {
          weatherData.value = cached;
          return;
        }
      }

      const freshData = await fetchWeatherForecast();
      weatherData.value = freshData;
      setCachedData(freshData);
    } catch (err) {
      error.value = err.message || "Unknown error";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    weatherData,
    isLoading,
    error,
    loadWeather
  };
}