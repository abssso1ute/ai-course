<template>
  <div class="error-box">
    <p class="title">Ошибка</p>
    <p class="message">{{ message }}</p>

    <button @click="onRetry">Повторить</button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "Произошла ошибка"
  },
  onRetry: {
    type: Function,
    required: true
  }
});
</script>

<style scoped>
.error-box {
  border: 1px solid #ff5a5a;
  background: #ffecec;
  padding: 16px;
  border-radius: 12px;
}

.title {
  font-weight: bold;
  margin: 0 0 6px;
}

.message {
  margin: 0 0 12px;
}

button {
  padding: 10px 16px;
  border: none;
  background: #ff5a5a;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background: #e34848;
}
</style>