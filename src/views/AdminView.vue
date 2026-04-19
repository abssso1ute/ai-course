<script setup>
import { ref } from 'vue'
import { useParkingMapStore } from '../stores/parkingMapStore'

const parking = useParkingMapStore()
const priceInput = ref(String(parking.basePricePerHour))
const lastAction = ref('')

function applyPrice() {
  parking.setBasePrice(priceInput.value)
  lastAction.value = 'Тариф обновлён'
}

function add() {
  const id = parking.addSpot()
  lastAction.value = id ? `Возвращено в продажу: ${id}` : 'Нет деактивированных ячеек — сначала «удалите» место'
}

function remove() {
  const id = parking.removeRandomFreeSpot()
  lastAction.value = id ? `Снято с продажи: ${id}` : 'Нет свободных мест для деактивации'
}
</script>

<template>
  <div class="admin" data-testid="admin-page">
    <header class="head">
      <h1>Администрирование</h1>
      <RouterLink to="/">← На карту</RouterLink>
    </header>

    <section class="card">
      <h2>Статистика</h2>
      <div class="stats">
        <div>Всего активных ячеек: <strong>{{ parking.stats().total }}</strong></div>
        <div>Занято: <strong>{{ parking.stats().occupied }}</strong></div>
        <div>Забронировано: <strong>{{ parking.stats().reserved }}</strong></div>
        <div>Свободно: <strong>{{ parking.stats().free }}</strong></div>
        <div>Загрузка: <strong>{{ parking.stats().load }}%</strong></div>
      </div>
    </section>

    <section class="card">
      <h2>Тарифы</h2>
      <p class="muted">Базовая ставка ₽/ч (пересчёт цен на карте)</p>
      <div class="row">
        <input v-model="priceInput" type="number" min="0" step="5" data-testid="admin-price" />
        <button type="button" @click="applyPrice">Сохранить</button>
      </div>
    </section>

    <section class="card">
      <h2>Места</h2>
      <p class="muted">«Удалить» — снять свободную ячейку с продажи. «Добавить» — вернуть ранее снятую.</p>
      <div class="row">
        <button type="button" data-testid="admin-remove-spot" @click="remove">Удалить место</button>
        <button type="button" data-testid="admin-add-spot" @click="add">Добавить место</button>
      </div>
    </section>

    <p v-if="lastAction" class="toast" data-testid="admin-toast">{{ lastAction }}</p>
  </div>
</template>

<style scoped>
.admin {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 16px 40px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
h1 {
  margin: 0;
  font-size: 22px;
}
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
}
h2 {
  margin: 0 0 8px;
  font-size: 16px;
}
.stats {
  display: grid;
  gap: 6px;
  font-size: 14px;
}
.muted {
  color: var(--muted);
  font-size: 13px;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
input {
  border-radius: 10px;
  border: 1px solid #374151;
  background: #0b1220;
  color: var(--text);
  padding: 8px 10px;
  min-width: 140px;
}
button {
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1f2937;
  color: var(--text);
  padding: 8px 12px;
}
.toast {
  color: var(--accent);
  font-size: 13px;
}
</style>
