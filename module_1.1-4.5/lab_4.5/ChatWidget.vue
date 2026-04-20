<template>
  <div>
    <!-- Кнопка открытия чата -->
    <button
      class="chat-toggle"
      @click="isOpen = !isOpen"
      aria-label="Открыть чат"
    >
      Chat
    </button>

    <!-- Окно чата -->
    <div v-if="isOpen" class="chat-window" role="dialog" aria-label="Чат с ассистентом">
      
      <div class="messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.role]"
        >
          {{ msg.content }}
        </div>

        <div v-if="loading" class="loading">
          Ассистент печатает...
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="input"
          placeholder="Напишите сообщение..."
          aria-label="Поле ввода сообщения"
        />
        <button @click="sendMessage" aria-label="Отправить сообщение">
          Отправить
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const input = ref('')
const loading = ref(false)

const messages = ref([
  { role: 'assistant', content: 'Привет! Чем могу помочь?' }
])

async function sendMessage() {
  if (!input.value.trim()) return

  const userMessage = input.value

  messages.value.push({
    role: 'user',
    content: userMessage
  })

  input.value = ''
  loading.value = true

  const assistantMessage = {
    role: 'assistant',
    content: ''
  }

  messages.value.push(assistantMessage)

  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: userMessage,
      history: messages.value
    })
  })

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    assistantMessage.content += chunk
  }

  loading.value = false
}
</script>

<style scoped>
.chat-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.chat-window {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  height: 400px;
  border: 1px solid #ccc;
  background: white;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message.user {
  text-align: right;
}

.message.assistant {
  text-align: left;
}

.input-area {
  display: flex;
}
</style>