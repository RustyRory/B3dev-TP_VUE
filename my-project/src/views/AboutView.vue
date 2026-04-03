<template>
  <div class="mx-auto max-w-2xl px-4 sm:px-6 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-1">À propos</h1>
      <p class="text-gray-500">Informations sur ce projet</p>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
      <div class="p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-3">Technologies utilisées</h2>
        <ul class="space-y-2">
          <li v-for="tech in technologies" :key="tech.name" class="flex items-center gap-3">
            <span class="text-lg">{{ tech.icon }}</span>
            <div>
              <span class="text-sm font-medium text-gray-900">{{ tech.name }}</span>
              <span class="text-sm text-gray-400 ml-2">{{ tech.desc }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-3">Fonctionnalités</h2>
        <ul class="space-y-2">
          <li v-for="feature in features" :key="feature" class="flex items-center gap-2 text-sm text-gray-600">
            <span class="text-green-500 font-bold">✓</span>
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      technologies: [
        { icon: '💚', name: 'Vue.js 3', desc: 'Composition API' },
        { icon: '⚡', name: 'Socket.IO', desc: 'Temps réel' },
        { icon: '🚂', name: 'Express.js', desc: 'API REST' },
        { icon: '🍃', name: 'MongoDB', desc: 'Base de données' },
        { icon: '🐳', name: 'Docker', desc: 'Conteneurisation' },
        { icon: '🌐', name: 'Nginx', desc: 'Reverse proxy' },
      ],
      features: [
        'Chat en temps réel entre utilisateurs',
        'Authentification par pseudo',
        'Historique des messages',
        'Tableau de données utilisateurs',
        'Interface responsive',
      ]
    }
  }
}
</script>
