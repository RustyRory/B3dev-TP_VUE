<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { pseudo, color as globalColor } from "../config/authVariables.js"
import { config } from "../config/config.js"
import UiButton from "../components/ui/Button.vue"
import UiInput from "../components/ui/Input.vue"

const router = useRouter()

const COLORS = [
  { label: "Ardoise",  value: "bg-slate-500"  },
  { label: "Bleu",     value: "bg-blue-500"   },
  { label: "Violet",   value: "bg-violet-500" },
  { label: "Rose",     value: "bg-pink-500"   },
  { label: "Orange",   value: "bg-orange-500" },
  { label: "Vert",     value: "bg-green-500"  },
  { label: "Cyan",     value: "bg-cyan-500"   },
  { label: "Rouge",    value: "bg-red-500"    },
]

// --- Couleur ---
const selectedColor = ref(globalColor.value)
const colorSuccess = ref(false)
const colorError = ref("")
const colorLoading = ref(false)

const saveColor = async () => {
  colorLoading.value = true
  colorError.value = ""
  colorSuccess.value = false
  try {
    const res = await fetch(`${config.backend}/api/auth/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ color: selectedColor.value })
    })
    if (res.ok) {
      globalColor.value = selectedColor.value
      colorSuccess.value = true
      setTimeout(() => colorSuccess.value = false, 3000)
    } else {
      const data = await res.json()
      colorError.value = data.error || "Erreur"
    }
  } catch {
    colorError.value = "Erreur réseau"
  } finally {
    colorLoading.value = false
  }
}

// --- Mot de passe ---
const currentPassword = ref("")
const newPassword = ref("")
const newPasswordConfirm = ref("")
const passwordSuccess = ref(false)
const passwordError = ref("")
const passwordLoading = ref(false)

const savePassword = async () => {
  passwordError.value = ""
  passwordSuccess.value = false
  if (newPassword.value.length < 4) { passwordError.value = "4 caractères minimum"; return }
  if (newPassword.value !== newPasswordConfirm.value) { passwordError.value = "Les mots de passe ne correspondent pas"; return }

  passwordLoading.value = true
  try {
    const res = await fetch(`${config.backend}/api/auth/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword: currentPassword.value, newPassword: newPassword.value })
    })
    const data = await res.json()
    if (res.ok) {
      currentPassword.value = ""
      newPassword.value = ""
      newPasswordConfirm.value = ""
      passwordSuccess.value = true
      setTimeout(() => passwordSuccess.value = false, 3000)
    } else {
      passwordError.value = data.error || "Erreur"
    }
  } catch {
    passwordError.value = "Erreur réseau"
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-10">

    <!-- En-tête -->
    <div class="flex items-center gap-4 mb-8">
      <button @click="router.back()" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p class="text-sm text-gray-500">Connecté en tant que <span class="font-medium text-gray-900">{{ pseudo }}</span></p>
      </div>
    </div>

    <div class="space-y-6">

      <!-- Section avatar -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-1">Avatar</h2>
        <p class="text-sm text-gray-500 mb-5">Choisis la couleur de ton avatar.</p>

        <div class="flex items-center gap-5 mb-5">
          <div :class="['w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow transition-all duration-300', selectedColor]">
            {{ pseudo[0]?.toUpperCase() }}
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ pseudo }}</p>
            <p class="text-sm text-gray-400">{{ COLORS.find(c => c.value === selectedColor)?.label }}</p>
          </div>
        </div>

        <div class="grid grid-cols-8 gap-2 mb-5">
          <button
            v-for="c in COLORS"
            :key="c.value"
            @click="selectedColor = c.value"
            :title="c.label"
            :class="[
              'relative aspect-square rounded-xl transition-all duration-150',
              c.value,
              selectedColor === c.value
                ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            ]"
          >
            <svg v-if="selectedColor === c.value" class="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-3">
          <UiButton @click="saveColor" :disabled="colorLoading || selectedColor === globalColor">
            {{ colorLoading ? 'Enregistrement...' : 'Enregistrer' }}
          </UiButton>
          <p v-if="colorSuccess" class="text-sm text-green-600">✓ Couleur mise à jour</p>
          <p v-if="colorError" class="text-sm text-red-500">{{ colorError }}</p>
        </div>
      </div>

      <!-- Section mot de passe -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-1">Mot de passe</h2>
        <p class="text-sm text-gray-500 mb-5">Modifie ton mot de passe de connexion.</p>

        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Mot de passe actuel</label>
            <UiInput v-model="currentPassword" type="password" placeholder="••••••••" class="w-full" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <UiInput v-model="newPassword" type="password" placeholder="••••••••" class="w-full" />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
            <UiInput v-model="newPasswordConfirm" type="password" placeholder="••••••••" class="w-full" />
          </div>
        </div>

        <div class="flex items-center gap-3 mt-5">
          <UiButton @click="savePassword" :disabled="passwordLoading">
            {{ passwordLoading ? 'Enregistrement...' : 'Modifier le mot de passe' }}
          </UiButton>
          <p v-if="passwordSuccess" class="text-sm text-green-600">✓ Mot de passe modifié</p>
          <p v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</p>
        </div>
      </div>

    </div>
  </div>
</template>
