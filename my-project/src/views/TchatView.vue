<script setup>
import { ref, onMounted, watch } from "vue"
import { io } from "socket.io-client"
import { isLogged, isLoading, pseudo } from "../config/authVariables.js"
import { useRouter } from "vue-router"
import { config } from "../config/config.js"

const router = useRouter()
const messages = ref([])
const message = ref("")

// ⚡ Connecte Socket.io vers le backend (PAS /api)
const socket = io(config.backend, { withCredentials: true })

// Historique et nouveaux messages
onMounted(() => {
  socket.on("historique", (msgs) => { messages.value = msgs })
  socket.on("message", (msg) => { messages.value.push(msg) })
})

// Redirection si non connecté
watch([isLogged, isLoading], ([logged, loading]) => {
  if (!loading && !logged) router.push("/")
})

// Envoyer message
const sendMessage = () => {
  if (!message.value) return
  socket.emit("nouveauMessage", { pseudo: pseudo.value, message: message.value })
  message.value = ""
}
</script>

<template>
  <div>
    <h1>Chat</h1>
    <div style="height:300px; overflow:auto; border:1px solid #ccc; margin:10px 0;">
      <div v-for="(msg, index) in messages" :key="index">
        <strong>{{ msg.pseudo }}</strong> : {{ msg.message }}
        <small>({{ msg.date }})</small>
      </div>
    </div>
    <input v-model="message" placeholder="Message..." />
    <button @click="sendMessage">Envoyer</button>
  </div>
</template>