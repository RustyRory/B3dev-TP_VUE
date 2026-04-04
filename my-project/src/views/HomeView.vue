<script setup>
import { isLogged } from "../config/authVariables.js"
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16">

    <!-- Hero -->
    <div class="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 mb-8">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">TP VUE</h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
        Découvrez ce projet réalisé dans le cadre de <strong class="text-gray-700">MyDigitalSchool</strong>,
        pour apprendre à créer des applications web dynamiques avec
        <strong class="text-gray-700">Vue.js</strong>, <strong class="text-gray-700">Express</strong> et
        <strong class="text-gray-700">Socket.IO</strong>.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <router-link
          to="/tchat"
          class="inline-flex items-center justify-center rounded-md bg-gray-900 text-white text-sm font-medium h-10 px-6 hover:bg-gray-700 transition-colors"
        >
          Aller au Tchat
        </router-link>
        <router-link
          to="/about"
          class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium h-10 px-6 hover:bg-gray-50 transition-colors"
        >
          En savoir plus
        </router-link>
      </div>
    </div>

    <!-- Carte 3 colonnes -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        <div class="p-6 text-center">
          <div class="text-3xl mb-3">💻</div>
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Apprentissage</h3>
          <p class="text-sm text-gray-500">
            Créer un serveur web, gérer les routes, manipuler les formulaires
            et tester l'application en temps réel.
          </p>
        </div>
        <div class="p-6 text-center">
          <div class="text-3xl mb-3">🛠</div>
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Fonctionnalités</h3>
          <p class="text-sm text-gray-500">
            Tchat en temps réel, tableau de données, inscription multi-étapes,
            paramètres de compte et interface responsive.
          </p>
        </div>
        <div class="p-6 text-center">
          <div class="text-3xl mb-3">📦</div>
          <h3 class="text-sm font-semibold text-gray-900 mb-2">GitHub</h3>
          <p class="text-sm text-gray-500">
            Accédez au code source complet, clonez le projet et suivez les
            évolutions.
          </p>
        </div>
      </div>
      <div class="border-t border-gray-100 px-6 py-4 text-center bg-gray-50">
        <template v-if="isLogged">
          <router-link
            to="/tchat"
            class="text-sm font-medium text-gray-900 hover:underline"
          >
            Accéder à votre espace →
          </router-link>
        </template>
        <template v-else>
          <span class="text-sm text-gray-500">
            Connectez-vous ou <router-link to="/register" class="font-medium text-gray-900 hover:underline">créez un compte</router-link> pour accéder au chat.
          </span>
        </template>
      </div>
    </div>

  </div>
</template>
