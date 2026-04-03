<script setup>
import { ref, watch } from "vue"
import { isLogged, isLoading } from "../config/authVariables.js"
import { useRouter } from "vue-router"

import UserList from "../components/UserList.vue"
import ChatBox from "../components/ChatBox.vue"
import DataTable from "../components/DataTable.vue"

const router = useRouter()
const activeTab = ref("tchat")
const showUserList = ref(false)

watch([isLogged, isLoading], ([logged, loading]) => {
  if (!loading && !logged) router.push("/")
})
</script>

<template>
  <div class="flex flex-col" style="height: calc(100vh - 64px);">

    <!-- Onglets -->
    <div class="border-b border-gray-200 bg-white px-4 flex-shrink-0">
      <div class="flex -mb-px">
        <button
          @click="activeTab = 'tchat'"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'tchat'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          💬 Tchat
        </button>
        <button
          @click="activeTab = 'datatable'"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'datatable'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          📊 Tableau de données
        </button>
      </div>
    </div>

    <!-- Contenu Tchat -->
    <div v-if="activeTab === 'tchat'" class="flex flex-1 overflow-hidden bg-white">

      <!-- Sidebar utilisateurs (cachée sur mobile par défaut) -->
      <div :class="[
        'border-r border-gray-200 overflow-hidden flex-shrink-0 transition-all duration-200',
        showUserList ? 'w-56' : 'w-0 md:w-56'
      ]">
        <UserList />
      </div>

      <!-- Zone de chat -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Bouton toggle sidebar sur mobile -->
        <div class="md:hidden flex items-center gap-2 px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <button
            @click="showUserList = !showUserList"
            class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ showUserList ? 'Masquer utilisateurs' : 'Voir utilisateurs' }}
          </button>
        </div>
        <ChatBox />
      </div>
    </div>

    <!-- Contenu DataTable -->
    <div v-else class="flex-1 overflow-auto p-4 sm:p-6">
      <DataTable />
    </div>

  </div>
</template>
