import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([
    {
      role: 'assistant',
      text: 'Привет! Я ассистент Smart Parking. Попросите найти место у входа, забронировать или спросите про вашу бронь.',
      ts: Date.now()
    }
  ])
  const pendingBookSpotId = ref(null)

  function pushUser(text) {
    messages.value.push({ role: 'user', text, ts: Date.now() })
  }

  function pushAssistant(text) {
    messages.value.push({ role: 'assistant', text, ts: Date.now() })
  }

  function setPendingBookSpotId(id) {
    pendingBookSpotId.value = id
  }

  function clearPendingBook() {
    pendingBookSpotId.value = null
  }

  return {
    messages,
    pendingBookSpotId,
    pushUser,
    pushAssistant,
    setPendingBookSpotId,
    clearPendingBook
  }
})
