export function validateEmail(email) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email) ? null : "Некорректный email";
}

export function validateRequired(value) {
  return value && value.trim() ? null : "Поле обязательно";
}

export function validateMinLength(value, min) {
  return value.length >= min ? null : `Минимум ${min} символов`;
}

export function validatePattern(value, regex) {
  return regex.test(value) ? null : "Некорректный формат";
}