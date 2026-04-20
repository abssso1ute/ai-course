<template>
  <article class="card">
    <h3 class="date">{{ date }}</h3>

    <div class="info">
      <p>Макс: <b>{{ maxTemp }}°C</b></p>
      <p>Мин: <b>{{ minTemp }}°C</b></p>
      <p>Ветер: <b>{{ windSpeed }} м/с</b></p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  date: String,
  maxTemp: Number,
  minTemp: Number,
  windSpeed: Number
});
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #ddd;
  padding: 14px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}

.date {
  margin: 0 0 10px;
  font-size: 16px;
}

.info p {
  margin: 6px 0;
  color: #333;
}
</style>