<script setup>
import { ref, onMounted } from "vue"
import { io } from "socket.io-client"
import { pseudo } from "../config/authVariables.js"
import { config } from "../config/config.js"

const messages = ref([])
const message = ref("")

const socket = io(new URL(config.backend).origin, {
  withCredentials: true,
  path: "/B3dev-TP_VUE/socket.io/"
})

onMounted(() => {
  socket.on("historique", (msgs) => {
    messages.value = msgs
  })

  socket.on("message", (msg) => {
    messages.value.push(msg)
  })
})

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
    <h3>Chat</h3>

    <div style="height:300px; overflow:auto; border:1px solid #ccc; margin:10px 0;">
      <div v-for="(msg, index) in messages" :key="index">
        <strong>{{ msg.pseudo }}</strong> :
        {{ msg.message }}
        <small>({{ msg.createdAt || msg.date }})</small>
      </div>
    </div>

    <input v-model="message" placeholder="Message..." />
    <button @click="sendMessage">Envoyer</button>
  </div>
</template>