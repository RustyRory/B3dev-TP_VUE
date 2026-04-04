<script setup>
import { ref, onMounted, computed } from "vue"
import { config } from "../config/config.js"

const props = defineProps({
  onlineUsers: { type: Array, default: () => [] }
})

const users = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`${config.backend}/api/users`, { credentials: "include" })
    users.value = await res.json()
  } catch (err) {
    console.error("Erreur users:", err)
  }
})

const getOnlineInfo = (pseudo) => props.onlineUsers.find(u => u.pseudo === pseudo) || null
const isOnline = (pseudo) => !!getOnlineInfo(pseudo)

const sortedUsers = computed(() =>
  [...users.value].sort((a, b) => (isOnline(b.pseudo) ? 1 : 0) - (isOnline(a.pseudo) ? 1 : 0))
)

const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500']
const getInitial = (p) => p ? p[0].toUpperCase() : '?'
const getColor = (p) => avatarColors[p ? p.charCodeAt(0) % avatarColors.length : 0]
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="px-4 py-3 border-b border-gray-200">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Utilisateurs
        <span class="ml-1 text-green-500">({{ onlineUsers.length }} en ligne)</span>
      </h3>
    </div>

    <div v-if="users.length === 0" class="flex-1 flex items-center justify-center px-4">
      <p class="text-sm text-gray-400 text-center">Aucun utilisateur</p>
    </div>

    <ul v-else class="flex-1 overflow-y-auto divide-y divide-gray-100">
      <li
        v-for="user in sortedUsers"
        :key="user._id"
        class="relative flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-150 group"
        :class="isOnline(user.pseudo) && getOnlineInfo(user.pseudo)?.city ? 'hover:pb-7' : ''"
      >
        <div class="relative flex-shrink-0">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold', getColor(user.pseudo)]">
            {{ getInitial(user.pseudo) }}
          </div>
          <span :class="[
            'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
            isOnline(user.pseudo) ? 'bg-green-400' : 'bg-gray-300'
          ]"></span>
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 truncate">{{ user.pseudo }}</p>
          <p :class="['text-xs', isOnline(user.pseudo) ? 'text-green-500' : 'text-gray-400']">
            {{ isOnline(user.pseudo) ? 'En ligne' : (user.lastMessageAt ? new Date(user.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hors ligne') }}
          </p>
        </div>

        <!-- Ville (géolocalisation) — affichée inline sous le statut au hover -->
        <div
          v-if="isOnline(user.pseudo) && getOnlineInfo(user.pseudo)?.city"
          class="absolute bottom-0 left-0 right-0 px-4 pb-1
                 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
        >
          <p class="text-xs text-gray-400 flex items-center gap-1 truncate">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.667 3.5-8.327a8 8 0 10-16 0c0 3.66 1.557 6.315 3.5 8.327a19.583 19.583 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            {{ getOnlineInfo(user.pseudo).city }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
