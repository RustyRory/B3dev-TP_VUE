<script setup>
import { ref, onMounted } from "vue"
import { io } from "socket.io-client"
import { getCurrentInstance } from "vue"
import { isLogged, isLoading, pseudo } from "../store/auth"
import { watch } from "vue"
import { useRouter } from "vue-router"
import { config } from "../config/config.js"  // <-- notre config .env

const { proxy } = getCurrentInstance()

// ⚡ Connecte socket.io à l'API via l'URL publique
const socket = io(config.apiUrl.replace("/api", ""), {
  withCredentials: true
})

const messages = ref([])
const message = ref("")

const router = useRouter()

// Redirection si non connecté
watch([isLogged, isLoading], ([logged, loading]) => {
  if (!loading && !logged) router.push("/")
})

onMounted(() => {
  socket.on("historique", (msgs) => {
    messages.value = msgs
  })

  socket.on("message", (msg) => {
    messages.value.push(msg)
  })
})

// envoyer message
const sendMessage = () => {
  if (!message.value) return

  socket.emit("nouveauMessage", {
    pseudo: pseudo.value,
    message: message.value
  })

  message.value = ""
}
</script>

<template>
  <div>
    <h1>Chat</h1>

    <!-- Messages -->
    <div style="height:300px; overflow:auto; border:1px solid #ccc; margin:10px 0;">
      <div v-for="(msg, index) in messages" :key="index">
        <strong>{{ msg.pseudo }}</strong> : {{ msg.message }}
        <small>({{ msg.date }})</small>
      </div>
    </div>

    <!-- Input -->
    <input v-model="message" placeholder="Message..." />
    <button @click="sendMessage">Envoyer</button>
  </div>
</template>