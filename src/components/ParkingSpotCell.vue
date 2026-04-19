<script setup>
defineProps({
  spot: {
    type: Object,
    default: null
  },
  highlighted: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="cell"
    :class="[
      !spot || spot.inactive ? 'inactive' : spot.status,
      { hi: highlighted && spot && !spot.inactive }
    ]"
    :title="spot && !spot.inactive ? `${spot.id} · ${spot.price} ₽/ч` : ''"
    :data-spot-id="spot && !spot.inactive ? spot.id : undefined"
  >
    <span v-if="!spot || spot.inactive" class="muted">—</span>
    <span v-else class="dot" />
  </div>
</template>

<style scoped>
.cell {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  border: 1px solid #1f2937;
  display: grid;
  place-items: center;
  font-size: 10px;
  color: #9ca3af;
  transition: box-shadow 0.15s ease, transform 0.12s ease;
}
.cell:hover {
  transform: translateY(-1px);
}
.free {
  background: rgba(34, 197, 94, 0.18);
  border-color: rgba(34, 197, 94, 0.45);
}
.occupied {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.45);
}
.reserved {
  background: rgba(234, 179, 8, 0.22);
  border-color: rgba(234, 179, 8, 0.45);
}
.inactive {
  background: #0f172a;
  opacity: 0.55;
}
.hi {
  box-shadow: 0 0 0 2px #a855f7, 0 0 18px rgba(168, 85, 247, 0.45);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: currentColor;
}
.muted {
  opacity: 0.5;
}
.free .dot {
  color: #4ade80;
}
.occupied .dot {
  color: #f87171;
}
.reserved .dot {
  color: #facc15;
}
</style>
