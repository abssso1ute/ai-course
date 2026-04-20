import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([
    {
      role: 'assistant',
      text:
        'Я аналитический ассистент дашборда. Примеры: «покажи только трамваи на северо-западе», «спрячь графики», «график загрузки маршрута 555 за неделю», «автобусы опаздывающие более чем на 5 минут».',
      ts: Date.now()
    }
  ])
  const pendingCommand = ref(null)

  function pushUser(text) {
    messages.value.push({ role: 'user', text, ts: Date.now() })
  }

  function pushAssistant(text) {
    messages.value.push({ role: 'assistant', text, ts: Date.now() })
  }

  function setPendingCommand(cmd) {
    pendingCommand.value = cmd
  }

  return {
    messages,
    pendingCommand,
    pushUser,
    pushAssistant,
    setPendingCommand
  }
})
