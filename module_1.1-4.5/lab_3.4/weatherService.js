const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeatherForecast(latitude = 55.7558, longitude = 37.6173) {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max&current_weather=true&timezone=auto&forecast_days=3`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}