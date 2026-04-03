<script setup>
import { computed, onMounted } from "vue"
import { isLogged, pseudo, isLoading } from "../config/authVariables.js"
import { config } from "../config/config.js"
import UiButton from "./ui/Button.vue"
import UiInput from "./ui/Input.vue"

onMounted(async () => {
  try {
    const res = await fetch(`${config.backend}/api/auth/me`, { credentials: "include" })
    if (res.ok) {
      const data = await res.json()
      pseudo.value = data.pseudo
      isLogged.value = true
    }
  } catch {
    console.log("Pas connecté")
  } finally {
    isLoading.value = false
  }
})

const pseudoLocal = computed({
  get: () => pseudo.value,
  set: (v) => pseudo.value = v
})

const login = async () => {
  if (!pseudo.value) return
  const res = await fetch(`${config.backend}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ pseudo: pseudo.value })
  })
  if (res.ok) isLogged.value = true
}

const logout = async () => {
  await fetch(`${config.backend}/api/auth/logout`, { method: "POST", credentials: "include" })
  pseudo.value = ""
  isLogged.value = false
  window.location.href = "/B3dev-TP_VUE/"
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="text-sm text-gray-400">Chargement...</div>

    <div v-else-if="!isLogged" class="flex items-center gap-2">
      <UiInput
        v-model="pseudoLocal"
        placeholder="Votre pseudo"
        class="w-36"
        @keyup.enter="login"
      />
      <UiButton size="sm" @click="login">Connexion</UiButton>
    </div>

    <div v-else class="flex items-center gap-3">
      <span class="text-sm text-gray-600">
        Bonjour, <span class="font-semibold text-gray-900">{{ pseudo }}</span>
      </span>
      <UiButton variant="outline" size="sm" @click="logout">Déconnexion</UiButton>
    </div>
  </div>
</template>
