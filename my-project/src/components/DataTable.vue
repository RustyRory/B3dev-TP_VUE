<script setup>
import { ref, onMounted } from "vue"
import { config } from "../config/config.js"

const users = ref([])

onMounted(async () => {
  const res = await fetch(`${config.backend}/api/users`)
  users.value = await res.json()
})
</script>

<template>
  <div>
    <h2>Utilisateurs</h2>

    <table border="1">
      <tr>
        <th>Pseudo</th>
        <th>Créé le</th>
        <th>Dernier message</th>
      </tr>

      <tr v-for="user in users" :key="user._id">
        <td>{{ user.pseudo }}</td>
        <td>{{ new Date(user.createdAt).toLocaleString() }}</td>
        <td>{{ user.lastMessageAt ? new Date(user.lastMessageAt).toLocaleString() : "-" }}</td>
      </tr>
    </table>
  </div>
</template>