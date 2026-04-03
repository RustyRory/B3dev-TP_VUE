<script setup>
import { ref, onMounted, nextTick } from "vue"
import { io } from "socket.io-client"
import { pseudo } from "../config/authVariables.js"
import { config } from "../config/config.js"
import UiButton from "./ui/Button.vue"
import UiInput from "./ui/Input.vue"

const messages = ref([])
const message = ref("")
const messagesContainer = ref(null)

const socket = io(new URL(config.backend).origin, {
  withCredentials: true,
  path: "/B3dev-TP_VUE/socket.io/"
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  socket.on("historique", (msgs) => {
    messages.value = msgs
    scrollToBottom()
  })
  socket.on("message", (msg) => {
    messages.value.push(msg)
    scrollToBottom()
  })
})

const sendMessage = () => {
  if (!message.value.trim()) return
  socket.emit("nouveauMessage", { pseudo: pseudo.value, message: message.value })
  message.value = ""
}
</script>

<template>
  <div class="flex flex-col h-full">

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <p class="text-sm text-gray-400">Aucun message pour l'instant...</p>
      </div>

      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['flex', msg.pseudo === pseudo ? 'justify-end' : 'justify-start']"
      >
        <div :class="[
          'max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm',
          msg.pseudo === pseudo
            ? 'bg-gray-900 text-white rounded-br-none'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
        ]">
          <p v-if="msg.pseudo !== pseudo" class="text-xs font-semibold mb-1 opacity-60">
            {{ msg.pseudo }}
          </p>
          <p>{{ msg.message }}</p>
          <p :class="['text-xs mt-1', msg.pseudo === pseudo ? 'text-gray-400' : 'text-gray-400']">
            {{ msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Saisie -->
    <div class="border-t border-gray-200 bg-white p-3 flex gap-2">
      <UiInput
        v-model="message"
        placeholder="Votre message..."
        class="flex-1"
        @keyup.enter="sendMessage"
      />
      <UiButton @click="sendMessage">Envoyer</UiButton>
    </div>
  </div>
</template>
