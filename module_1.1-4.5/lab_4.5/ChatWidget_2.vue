<template>
  <div>
    <button @click="isOpen = !isOpen">Chat</button>

    <div v-if="isOpen">
      <button @click="resetChat">Новый диалог</button>

      <div>
        <div v-for="(msg, i) in messages" :key="i">
          <b>{{ msg.role }}:</b> {{ msg.content }}
        </div>
      </div>

      <input v-model="input" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const isOpen = ref(false)
const input = ref("")

const messages = ref([
  { role: "assistant", content: "Привет!" }
])

function resetChat() {
  messages.value = [
    { role: "assistant", content: "Новый диалог начат." }
  ]
}

async function sendMessage() {
  const text = input.value
  if (!text) return

  messages.value.push({ role: "user", content: text })
  input.value = ""

  const assistant = { role: "assistant", content: "" }
  messages.value.push(assistant)

  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      history: messages.value
    })
  })

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    assistant.content += decoder.decode(value)
  }
}
</script>