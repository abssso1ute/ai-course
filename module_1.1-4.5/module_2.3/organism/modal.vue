<template>
  <div v-if="isOpen" class="backdrop" @click.self="close">
    <div class="modal">
      <button class="close" @click="close">×</button>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(["onClose"]);

function close() {
  emit("onClose");
}

function handleKey(e) {
  if (e.key === "Escape") {
    close();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKey);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKey);
});
</script>

<style>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  animation: popIn 0.2s ease;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>