<script setup>
import { ref, onMounted } from "vue"
import { config } from "../config/config.js"

const users = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`${config.backend}/api/users`, {
      credentials: "include"
    })
    users.value = await res.json()
  } catch (err) {
    console.error("Erreur users:", err)
  }
})
</script>

<template>
  <div>
    <h3>Utilisateurs</h3>

    <div v-if="users.length === 0">Aucun utilisateur</div>

    <ul>
      <li v-for="user in users" :key="user._id">
        <strong>{{ user.pseudo }}</strong><br>
        <small>
          Dernier msg :
          {{ user.lastMessageAt
            ? new Date(user.lastMessageAt).toLocaleTimeString()
            : "-" }}
        </small>
      </li>
    </ul>
  </div>
</template>