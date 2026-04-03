<script setup>
import { ref, onMounted } from "vue"
import { config } from "../config/config.js"

const users = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`${config.backend}/api/users`, { credentials: "include" })
    users.value = await res.json()
  } catch (err) {
    console.error("Erreur users:", err)
  }
})

const getInitial = (p) => p ? p[0].toUpperCase() : '?'
const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500']
const getColor = (p) => avatarColors[p ? p.charCodeAt(0) % avatarColors.length : 0]
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="px-4 py-3 border-b border-gray-200">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Utilisateurs <span class="ml-1 text-gray-400">({{ users.length }})</span>
      </h3>
    </div>

    <div v-if="users.length === 0" class="flex-1 flex items-center justify-center px-4">
      <p class="text-sm text-gray-400 text-center">Aucun utilisateur</p>
    </div>

    <ul v-else class="flex-1 overflow-y-auto divide-y divide-gray-100">
      <li
        v-for="user in users"
        :key="user._id"
        class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', getColor(user.pseudo)]">
          {{ getInitial(user.pseudo) }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 truncate">{{ user.pseudo }}</p>
          <p class="text-xs text-gray-400">
            {{ user.lastMessageAt ? new Date(user.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Inactif' }}
          </p>
        </div>
        <div :class="['w-2 h-2 rounded-full flex-shrink-0', user.lastMessageAt ? 'bg-green-400' : 'bg-gray-300']"></div>
      </li>
    </ul>
  </div>
</template>
