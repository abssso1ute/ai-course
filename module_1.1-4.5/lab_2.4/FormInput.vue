<template>
  <div class="field">
    <label :for="name">{{ label }}</label>

    <component
      :is="as === 'textarea' ? 'textarea' : 'input'"
      :id="name"
      :name="name"
      :value="modelValue"
      @input="onInput"
      :class="{ error: error }"
    />

    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  name: String,
  modelValue: [String, Number],
  error: String,
  as: {
    type: String,
    default: "text"
  }
});

const emit = defineEmits(["update:modelValue"]);

function onInput(e) {
  emit("update:modelValue", e.target.value);
}
</script>

<style>
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

input, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.error {
  border-color: red;
}

.error-text {
  color: red;
  font-size: 12px;
}
</style>