<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../stores/chatStore'
import { handleUserRequest } from '../agent/handleUserRequest'

const chat = useChatStore()
const { messages, pendingBookSpotId } = storeToRefs(chat)
const input = ref('')

function send() {
  const text = input.value.trim()
  if (!text) return
  chat.pushUser(text)
  input.value = ''
  handleUserRequest(text)
}

function book() {
  handleUserRequest('забронируй')
}
</script>

<template>
  <section class="chat" aria-label="Ассистент парковки">
    <header class="head">
      <h2>AI-ассистент</h2>
      <p class="sub">Запросы на русском: поиск, бронь, отмена</p>
    </header>
    <div class="thread" data-testid="chat-thread">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="msg"
        :class="m.role"
        :data-role="m.role"
      >
        {{ m.text }}
      </div>
    </div>
    <div v-if="pendingBookSpotId" class="actions">
      <button type="button" data-testid="book-button" @click="book">Забронировать</button>
      <span class="hint">место {{ pendingBookSpotId }}</span>
    </div>
    <form class="composer" @submit.prevent="send">
      <textarea
        v-model="input"
        rows="2"
        placeholder="Например: найди свободное место у входа №3"
        data-testid="chat-input"
        @keydown.enter.exact.prevent="send"
      />
      <button type="submit" data-testid="chat-send">Отправить</button>
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
  min-height: 420px;
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
  padding-right: 4px;
}
.msg {
  padding: 8px 10px;
  border-radius: 10px;
  max-width: 92%;
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
  background: #111827;
  border: 1px solid #1f2937;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.actions button {
  background: linear-gradient(180deg, #38bdf8, #0ea5e9);
  color: #0b1220;
  border: 0;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 600;
}
.hint {
  color: var(--muted);
  font-size: 12px;
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
.composer button {
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1f2937;
  color: var(--text);
  padding: 10px 12px;
}
</style>
