<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">

    <!-- En-tête -->
    <div class="text-center mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">À propos de ce projet</h1>
      <p class="text-gray-500 max-w-xl mx-auto">
        Ce TP a été réalisé dans le cadre de la formation
        <strong class="text-gray-700">MyDigitalSchool</strong>. L'objectif est de se familiariser avec
        <strong class="text-gray-700">Vue.js</strong>, <strong class="text-gray-700">Express</strong> et
        <strong class="text-gray-700">Socket.IO</strong> pour créer des applications web dynamiques.
      </p>
    </div>

    <!-- Objectifs + Fonctionnalités -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

      <!-- Objectifs -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 text-center">
          <h2 class="text-base font-semibold text-gray-900">🎯 Objectifs</h2>
          <p class="text-xs text-gray-400 mt-0.5">Apprentissage de :</p>
        </div>
        <ul class="divide-y divide-gray-50">
          <li v-for="obj in objectives" :key="obj" class="px-5 py-3 text-sm text-gray-600 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></span>
            {{ obj }}
          </li>
        </ul>
      </div>

      <!-- Fonctionnalités -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 text-center">
          <h2 class="text-base font-semibold text-gray-900">🛠 Fonctionnalités</h2>
          <p class="text-xs text-gray-400 mt-0.5">Ce que le site offre :</p>
        </div>
        <ul class="divide-y divide-gray-50">
          <li v-for="feat in features" :key="feat" class="px-5 py-3 text-sm text-gray-600 flex items-center gap-2">
            <span class="text-green-500 font-bold flex-shrink-0">✓</span>
            {{ feat }}
          </li>
        </ul>
      </div>
    </div>

    <!-- GitHub -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
      <div class="px-5 py-4 border-b border-gray-100 text-center">
        <h2 class="text-base font-semibold text-gray-900">📦 Dépôt GitHub</h2>
      </div>
      <div class="p-6 text-center">
        <p class="text-sm text-gray-500 mb-5">
          Retrouvez tout le code du TP sur GitHub pour consulter, cloner ou contribuer.
        </p>
        <a
          href="https://github.com/RustyRory/B3dev-TP_VUE"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium h-10 px-5 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.929.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          Voir le repository
        </a>
      </div>
    </div>

    <!-- Technologies -->
    <div class="bg-gray-900 text-white rounded-2xl px-6 py-4 text-center text-sm">
      <span class="font-medium">Technologies utilisées : </span>
      <span class="text-gray-400">Vue.js 3 • Express • Socket.IO • MongoDB • Docker • Nginx • Tailwind CSS</span>
    </div>

  </div>
</template>

<script setup>
const objectives = [
  "Création d'un serveur web avec Node.js et Express",
  "Gestion des routes et API REST",
  "Utilisation de Vue.js 3 (Composition API)",
  "Communication en temps réel avec Socket.IO",
  "Authentification par cookie et mot de passe",
  "Déploiement avec Docker et CI/CD GitHub Actions",
]

const features = [
  "Pages dynamiques avec Vue Router",
  "Inscription multi-étapes avec validation",
  "Système login / logout sécurisé (bcrypt)",
  "Tchat en temps réel + historique MongoDB",
  "Tableau de données utilisateurs",
  "Géolocalisation des utilisateurs connectés",
  "Paramètres de compte (avatar, mot de passe)",
  "Interface responsive avec Tailwind CSS",
  "PWA installable sur mobile et desktop",
]
</script>
