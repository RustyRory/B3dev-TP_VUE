<script setup>
import { ref } from "vue"
import ConnexionBox from "./ConnexionBox.vue"
import { isLogged, isLoading } from "../config/authVariables.js"

const menuOpen = ref(false)
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">

        <!-- Logo + liens desktop -->
        <div class="flex items-center gap-6">
          <router-link to="/" class="text-base font-bold text-gray-900 tracking-tight">
            B3dev TP
          </router-link>
          <div class="hidden md:flex items-center gap-1">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              active-class="!text-gray-900 font-medium bg-gray-100"
              exact-active-class="!text-gray-900 font-medium bg-gray-100"
            >
              Accueil
            </router-link>
            <router-link
              to="/about"
              class="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              active-class="!text-gray-900 font-medium bg-gray-100"
            >
              À propos
            </router-link>
            <router-link
              v-if="!isLoading && isLogged"
              to="/tchat"
              class="px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              active-class="!text-gray-900 font-medium bg-gray-100"
            >
              Espace
            </router-link>
          </div>
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
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu mobile déroulant -->
    <div v-if="menuOpen" class="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
      <router-link
        to="/"
        @click="menuOpen = false"
        class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        Accueil
      </router-link>
      <router-link
        to="/about"
        @click="menuOpen = false"
        class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        À propos
      </router-link>
      <router-link
        v-if="!isLoading && isLogged"
        to="/tchat"
        @click="menuOpen = false"
        class="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        Espace
      </router-link>
      <div class="pt-3 border-t border-gray-100">
        <ConnexionBox />
      </div>
    </div>
  </nav>
</template>
