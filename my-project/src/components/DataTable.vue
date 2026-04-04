<script setup>
import { ref, onMounted } from "vue"
import { config } from "../config/config.js"

const props = defineProps({
  onlineUsers: { type: Array, default: () => [] }
})

const users = ref([])

onMounted(async () => {
  const res = await fetch(`${config.backend}/api/users`)
  users.value = await res.json()
})

const getOnlineInfo = (pseudo) => props.onlineUsers.find(u => u.pseudo === pseudo) || null
const isOnline = (pseudo) => !!getOnlineInfo(pseudo)
</script>

<template>
  <div>
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Utilisateurs</h2>
      <p class="text-sm text-gray-500">
        {{ users.length }} utilisateur{{ users.length > 1 ? 's' : '' }} enregistré{{ users.length > 1 ? 's' : '' }}
        · <span class="text-green-600 font-medium">{{ onlineUsers.length }} en ligne</span>
      </p>
    </div>

    <div class="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pseudo</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Créé le</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Dernier message</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Messages</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="users.length === 0">
              <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">
                Aucun utilisateur enregistré
              </td>
            </tr>
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="relative flex-shrink-0">
                    <div class="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      {{ user.pseudo?.[0]?.toUpperCase() }}
                    </div>
                    <span :class="[
                      'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                      isOnline(user.pseudo) ? 'bg-green-400' : 'bg-gray-300'
                    ]"></span>
                  </div>
                  <span class="font-medium text-gray-900">{{ user.pseudo }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-500 hidden sm:table-cell">
                {{ new Date(user.createdAt).toLocaleString() }}
              </td>
              <td class="px-4 py-3 text-gray-500 hidden md:table-cell">
                {{ user.lastMessageAt ? new Date(user.lastMessageAt).toLocaleString() : '—' }}
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-gray-700 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {{ user.messageCount ?? 0 }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="relative inline-block group">
                  <span :class="[
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-default',
                    isOnline(user.pseudo) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  ]">
                    <span :class="['w-1.5 h-1.5 rounded-full', isOnline(user.pseudo) ? 'bg-green-500' : 'bg-gray-400']"></span>
                    {{ isOnline(user.pseudo) ? 'En ligne' : 'Hors ligne' }}
                  </span>
                  <!-- Tooltip ville -->
                  <div
                    v-if="isOnline(user.pseudo) && getOnlineInfo(user.pseudo)?.city"
                    class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  >
                    <div class="bg-gray-900 text-white text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.013 3.5-4.667 3.5-8.327a8 8 0 10-16 0c0 3.66 1.557 6.315 3.5 8.327a19.583 19.583 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                      </svg>
                      {{ getOnlineInfo(user.pseudo).city }}
                    </div>
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
