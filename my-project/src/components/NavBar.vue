<script setup>
import { ref } from "vue"
import ConnexionBox from "./ConnexionBox.vue"
import { isLogged, isLoading, pseudo, color } from "../config/authVariables.js"
import { useRouter } from "vue-router"

const router = useRouter()
const menuOpen = ref(false)

const close = () => menuOpen.value = false

const goAndClose = (path) => {
  router.push(path)
  close()
}
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">

        <!-- Logo -->
        <router-link to="/" class="text-base font-bold text-gray-900 tracking-tight" @click="close">
          B3dev TP
        </router-link>

        <!-- Liens desktop -->
        <div class="hidden md:flex items-center gap-1">
          <router-link
            to="/"
            class="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            exact-active-class="!text-gray-900 font-medium bg-gray-100"
          >Accueil</router-link>
          <router-link
            to="/about"
            class="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            active-class="!text-gray-900 font-medium bg-gray-100"
          >À propos</router-link>
          <router-link
            v-if="!isLoading && isLogged"
            to="/tchat"
            class="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            active-class="!text-gray-900 font-medium bg-gray-100"
          >Espace</router-link>
        </div>

        <!-- ConnexionBox desktop -->
        <div class="hidden md:block">
          <ConnexionBox />
        </div>

        <!-- Hamburger mobile -->
        <button
          @click="menuOpen = !menuOpen"
          class="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="md:hidden bg-white border-t border-gray-100">

      <!-- Profil si connecté -->
      <div v-if="!isLoading && isLogged" class="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0', color]">
          {{ pseudo[0]?.toUpperCase() }}
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">{{ pseudo }}</p>
          <p class="text-xs text-gray-400">Connecté</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="px-3 py-2 space-y-0.5">
        <button @click="goAndClose('/')" class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Accueil
        </button>
        <button @click="goAndClose('/about')" class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          À propos
        </button>
        <button v-if="!isLoading && isLogged" @click="goAndClose('/tchat')" class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Espace
        </button>
        <button v-if="!isLoading && isLogged" @click="goAndClose('/settings')" class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Paramètres
        </button>
      </div>

      <!-- Connexion / Déconnexion -->
      <div class="px-4 py-4 border-t border-gray-100">
        <ConnexionBox layout="mobile" />
      </div>

    </div>
  </nav>
</template>
