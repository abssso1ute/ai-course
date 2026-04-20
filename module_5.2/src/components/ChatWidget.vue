<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chatStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useRealtimeStore } from '@/stores/realtimeStore'
import { processTransportQuery } from '@/agent/transportAnalystAgent'

const chat = useChatStore()
const dash = useDashboardStore()
const rt = useRealtimeStore()
const { messages } = storeToRefs(chat)

const input = ref('')

function send() {
  const text = input.value.trim()
  if (!text) return
  chat.pushUser(text)
  input.value = ''

  const { assistantText, commands } = processTransportQuery(text, {
    vehicles: rt.vehicles
  })
  for (const cmd of commands) {
    dash.applyCommand(cmd)
  }
  chat.pushAssistant(assistantText)
}
</script>

<template>
  <section class="chat" aria-label="Аналитический ассистент">
    <header class="head">
      <h2>Транспортный аналитик</h2>
      <p class="sub">Запросы управляют фильтрами и графиками дашборда</p>
    </header>
    <div class="thread" role="log" aria-live="polite">
      <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role" :data-role="m.role">
        {{ m.text }}
      </div>
    </div>
    <form class="composer" @submit.prevent="send">
      <textarea
        v-model="input"
        rows="3"
        placeholder="Например: покажи трамваи на северо-западе"
        @keydown.enter.exact.prevent="send"
      />
      <button type="submit">Отправить</button>
    </form>
  </section>
</template>

<style scoped>
.chat {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-height: 380px;
}
.head h2 {
  margin: 0 0 4px;
  font-size: 16px;
}
.sub {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
.thread {
  flex: 1;
  overflow: auto;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.msg {
  padding: 8px 10px;
  border-radius: 10px;
  max-width: 94%;
  font-size: 14px;
  line-height: 1.35;
  white-space: pre-wrap;
}
.msg.user {
  align-self: flex-end;
  background: #0ea5e933;
  border: 1px solid #0ea5e955;
}
.msg.assistant {
  align-self: flex-start;
  background: #0b1220;
  border: 1px solid var(--border);
}
.composer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: end;
}
textarea {
  width: 100%;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid #374151;
  background: #0b1220;
  color: var(--text);
  padding: 8px 10px;
}
button {
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1f2937;
  color: var(--text);
  padding: 10px 12px;
  cursor: pointer;
}
button:hover {
  border-color: #475569;
}
</style>
