<script setup>
import { isLogged } from "../config/authVariables.js"
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-20">
    <div class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
        Bienvenue sur B3dev TP
      </h1>
      <p class="text-lg text-gray-500">
        Application de chat en temps réel avec Vue.js &amp; Socket.IO
      </p>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm p-8 text-center">
      <template v-if="!isLogged">
        <p class="text-gray-600 mb-6">
          Connectez-vous avec un pseudo pour accéder au chat et au tableau de données.
        </p>
        <p class="text-sm text-gray-400">
          Entrez votre pseudo dans la barre de navigation ci-dessus.
        </p>
      </template>
      <template v-else>
        <p class="text-gray-600 mb-6">Vous êtes connecté. Accédez à votre espace.</p>
        <router-link
          to="/tchat"
          class="inline-flex items-center justify-center rounded-md bg-gray-900 text-white text-sm font-medium h-10 px-6 hover:bg-gray-700 transition-colors"
        >
          Accéder à l'espace →
        </router-link>
      </template>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <div class="rounded-lg border border-gray-200 bg-white p-5">
        <div class="text-2xl mb-2">💬</div>
        <h3 class="text-sm font-semibold text-gray-900">Chat temps réel</h3>
        <p class="text-xs text-gray-500 mt-1">Socket.IO</p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-5">
        <div class="text-2xl mb-2">📊</div>
        <h3 class="text-sm font-semibold text-gray-900">Tableau de données</h3>
        <p class="text-xs text-gray-500 mt-1">Historique utilisateurs</p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-5">
        <div class="text-2xl mb-2">🔐</div>
        <h3 class="text-sm font-semibold text-gray-900">Authentification</h3>
        <p class="text-xs text-gray-500 mt-1">Par pseudo</p>
      </div>
    </div>
  </div>
</template>
