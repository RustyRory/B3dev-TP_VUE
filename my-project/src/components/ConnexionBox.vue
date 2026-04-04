<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { isLogged, pseudo, color, isLoading } from "../config/authVariables.js"
import { config } from "../config/config.js"
import UiButton from "./ui/Button.vue"
import UiInput from "./ui/Input.vue"

// mobile = layout vertical (dans le menu hamburger)
// desktop = layout horizontal compact (dans la navbar)
defineProps({
  layout: { type: String, default: 'desktop' } // 'desktop' | 'mobile'
})

const router = useRouter()

const pseudoInput = ref("")
const passwordInput = ref("")
const loginError = ref("")

onMounted(async () => {
  try {
    const res = await fetch(`${config.backend}/api/auth/me`, { credentials: "include" })
    if (res.ok) {
      const data = await res.json()
      pseudo.value = data.pseudo
      color.value = data.color || "bg-gray-500"
      isLogged.value = true
    }
  } catch {
    // pas connecté
  } finally {
    isLoading.value = false
  }
})

const login = async () => {
  loginError.value = ""
  if (!pseudoInput.value || !passwordInput.value) return
  const res = await fetch(`${config.backend}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ pseudo: pseudoInput.value, password: passwordInput.value })
  })
  const data = await res.json()
  if (res.ok) {
    pseudo.value = data.pseudo
    isLogged.value = true
    pseudoInput.value = ""
    passwordInput.value = ""
  } else {
    loginError.value = data.error || "Identifiants incorrects"
  }
}

const logout = async () => {
  await fetch(`${config.backend}/api/auth/logout`, { method: "POST", credentials: "include" })
  pseudo.value = ""
  color.value = "bg-gray-500"
  isLogged.value = false
  window.location.href = "/B3dev-TP_VUE/"
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="text-sm text-gray-400">Chargement...</div>

    <!-- Non connecté -->
    <div v-else-if="!isLogged">

      <!-- Layout mobile : vertical, pleine largeur -->
      <div v-if="layout === 'mobile'" class="space-y-2">
        <UiInput v-model="pseudoInput" placeholder="Pseudo" class="w-full" @keyup.enter="login" />
        <UiInput
          v-model="passwordInput"
          type="password"
          placeholder="Mot de passe"
          class="w-full"
          :error="!!loginError"
          @keyup.enter="login"
          @focus="loginError = ''"
        />
        <p v-if="loginError" class="flex items-center gap-1 text-xs text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ loginError }}
        </p>
        <div class="flex gap-2 pt-1">
          <UiButton size="sm" class="flex-1" @click="login">Connexion</UiButton>
          <UiButton size="sm" variant="outline" class="flex-1" @click="router.push('/register')">S'inscrire</UiButton>
        </div>
      </div>

      <!-- Layout desktop : horizontal compact -->
      <div v-else class="flex items-center gap-1.5">
        <UiInput v-model="pseudoInput" placeholder="Pseudo" class="w-24" @keyup.enter="login" />
        <div class="relative">
          <UiInput
            v-model="passwordInput"
            type="password"
            placeholder="Mot de passe"
            class="w-28"
            :error="!!loginError"
            @keyup.enter="login"
            @focus="loginError = ''"
          />
          <!-- Badge erreur sous le champ, ancré à droite pour ne pas sortir -->
          <div v-if="loginError" class="absolute top-full right-0 mt-1 z-50 pointer-events-none">
            <div class="bg-red-600 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap shadow-lg flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ loginError }}
            </div>
          </div>
        </div>
        <UiButton size="sm" @click="login">OK</UiButton>
        <UiButton size="sm" variant="outline" @click="router.push('/register')">S'inscrire</UiButton>
      </div>
    </div>

    <!-- Connecté -->
    <div v-else :class="['flex items-center gap-2', layout === 'mobile' ? 'flex-wrap' : '']">
      <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', color]">
        {{ pseudo[0]?.toUpperCase() }}
      </div>
      <span class="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{{ pseudo }}</span>
      <UiButton variant="ghost" size="sm" @click="router.push('/settings')" title="Paramètres">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </UiButton>
      <UiButton variant="outline" size="sm" @click="logout">Déconnexion</UiButton>
    </div>
  </div>
</template>
