<template>
  <div class="loader-wrap">
    <div class="spinner"></div>
    <p>Загрузка данных...</p>
  </div>
</template>

<style scoped>
.loader-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px;
  color: #444;
}

.spinner {
  width: 38px;
  height: 38px;
  border: 4px solid #ddd;
  border-top: 4px solid #333;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>