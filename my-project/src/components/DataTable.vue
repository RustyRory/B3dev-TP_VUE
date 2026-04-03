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
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Utilisateurs</h2>
      <p class="text-sm text-gray-500">
        {{ users.length }} utilisateur{{ users.length > 1 ? 's' : '' }} enregistré{{ users.length > 1 ? 's' : '' }}
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
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="users.length === 0">
              <td colspan="4" class="px-4 py-12 text-center text-sm text-gray-400">
                Aucun utilisateur enregistré
              </td>
            </tr>
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {{ user.pseudo?.[0]?.toUpperCase() }}
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
                <span :class="[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  user.lastMessageAt ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                ]">
                  {{ user.lastMessageAt ? 'Actif' : 'Inactif' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
