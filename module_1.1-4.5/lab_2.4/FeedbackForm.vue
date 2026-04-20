<template>
  <form @submit.prevent="onSubmit">

    <FormInput
      label="Имя"
      name="name"
      v-model="form.name"
      :error="errors.name"
    />

    <FormInput
      label="Email"
      name="email"
      v-model="form.email"
      :error="errors.email"
    />

    <div>
      <label>Тема</label>
      <select v-model="form.topic">
        <option>Техническая проблема</option>
        <option>Вопрос по курсу</option>
        <option>Сотрудничество</option>
        <option>Другое</option>
      </select>
    </div>

    <FormInput
      label="Сообщение"
      name="message"
      as="textarea"
      v-model="form.message"
      :error="errors.message"
    />

    <label>
      <input type="checkbox" v-model="form.agree" />
      Согласие на обработку
    </label>

    <button :disabled="!isFormValid">
      Отправить
    </button>

    <p v-if="success">Успешно отправлено</p>

  </form>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import FormInput from "./FormInput.vue";
import {
  validateEmail,
  validateRequired,
  validateMinLength
} from "./utils/validation.js";

const form = reactive({
  name: "",
  email: "",
  topic: "Техническая проблема",
  message: "",
  agree: false
});

const errors = reactive({});
const success = ref(false);

function validate() {
  errors.name = validateMinLength(form.name, 2);
  errors.email = validateEmail(form.email);
  errors.message = validateMinLength(form.message, 10);

  return !errors.name && !errors.email && !errors.message && form.agree;
}

const isFormValid = computed(() => validate());

function onSubmit() {
  if (validate()) {
    console.log("form sent", form);
    success.value = true;
  }
}
</script>