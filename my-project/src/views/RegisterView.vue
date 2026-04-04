<script setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import { isLogged, pseudo as globalPseudo, color as globalColor } from "../config/authVariables.js"
import { config } from "../config/config.js"
import UiButton from "../components/ui/Button.vue"
import UiInput from "../components/ui/Input.vue"

const router = useRouter()

// --- État du stepper ---
const step = ref(1)
const TOTAL_STEPS = 3

// --- Étape 1 : Pseudo ---
const pseudoInput = ref("")
const pseudoStatus = ref("idle") // idle | checking | available | taken | invalid
const pseudoError = ref("")

let checkTimer = null
watch(pseudoInput, (val) => {
  pseudoStatus.value = "idle"
  pseudoError.value = ""
  clearTimeout(checkTimer)

  if (val.length < 2) {
    if (val.length > 0) pseudoError.value = "2 caractères minimum"
    return
  }
  if (val.length > 20) {
    pseudoError.value = "20 caractères maximum"
    return
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(val)) {
    pseudoError.value = "Lettres, chiffres, _ et - uniquement"
    return
  }

  pseudoStatus.value = "checking"
  checkTimer = setTimeout(async () => {
    try {
      const res = await fetch(`${config.backend}/api/auth/check-pseudo?pseudo=${encodeURIComponent(val)}`)
      const data = await res.json()
      pseudoStatus.value = data.available ? "available" : "taken"
      if (!data.available) pseudoError.value = "Ce pseudo est déjà pris"
    } catch {
      pseudoStatus.value = "idle"
    }
  }, 400)
})

// --- Étape 1 : Mot de passe ---
const passwordInput = ref("")
const passwordConfirm = ref("")
const passwordError = computed(() => {
  if (passwordInput.value.length > 0 && passwordInput.value.length < 4) return "4 caractères minimum"
  if (passwordConfirm.value.length > 0 && passwordInput.value !== passwordConfirm.value) return "Les mots de passe ne correspondent pas"
  return ""
})

const canGoStep2 = computed(() =>
  pseudoStatus.value === "available" &&
  pseudoInput.value.length >= 2 &&
  passwordInput.value.length >= 4 &&
  passwordInput.value === passwordConfirm.value
)

// --- Étape 2 : Couleur ---
const COLORS = [
  { label: "Ardoise",  value: "bg-slate-500"  },
  { label: "Bleu",    value: "bg-blue-500"   },
  { label: "Violet",  value: "bg-violet-500" },
  { label: "Rose",    value: "bg-pink-500"   },
  { label: "Orange",  value: "bg-orange-500" },
  { label: "Vert",    value: "bg-green-500"  },
  { label: "Cyan",    value: "bg-cyan-500"   },
  { label: "Rouge",   value: "bg-red-500"    },
]
const selectedColor = ref(COLORS[0].value)

// --- Étape 3 : Confirmation ---
const isSubmitting = ref(false)
const submitError = ref("")

const submit = async () => {
  isSubmitting.value = true
  submitError.value = ""
  try {
    const res = await fetch(`${config.backend}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pseudo: pseudoInput.value, password: passwordInput.value, color: selectedColor.value })
    })
    const data = await res.json()
    if (!res.ok) {
      submitError.value = data.error || "Erreur lors de l'inscription"
      return
    }
    globalPseudo.value = data.pseudo
    globalColor.value = selectedColor.value
    isLogged.value = true
    router.push("/tchat")
  } catch {
    submitError.value = "Erreur réseau, réessaie."
  } finally {
    isSubmitting.value = false
  }
}

// --- Navigation ---
const goNext = () => { if (step.value < TOTAL_STEPS) step.value++ }
const goBack = () => { if (step.value > 1) step.value-- }

const getInitial = () => pseudoInput.value[0]?.toUpperCase() || "?"
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-10">
    <div class="w-full max-w-md">

      <!-- En-tête -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p class="mt-1 text-sm text-gray-500">Étape {{ step }} sur {{ TOTAL_STEPS }}</p>
      </div>

      <!-- Barre de progression -->
      <div class="flex items-center gap-2 mb-8">
        <div v-for="s in TOTAL_STEPS" :key="s" class="flex items-center flex-1">
          <div :class="[
            'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all duration-300 flex-shrink-0',
            step > s  ? 'bg-gray-900 border-gray-900 text-white'
            : step === s ? 'bg-white border-gray-900 text-gray-900'
            :              'bg-white border-gray-200 text-gray-400'
          ]">
            <svg v-if="step > s" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span v-else>{{ s }}</span>
          </div>
          <div v-if="s < TOTAL_STEPS" :class="[
            'flex-1 h-0.5 mx-2 transition-all duration-300',
            step > s ? 'bg-gray-900' : 'bg-gray-200'
          ]"></div>
        </div>
      </div>

      <!-- Carte du formulaire -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

        <!-- Étape 1 : Pseudo -->
        <div v-if="step === 1">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Choisis ton pseudo</h2>
          <p class="text-sm text-gray-500 mb-6">Il sera visible par tous les membres du chat.</p>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Pseudo</label>
            <div class="relative">
              <UiInput
                v-model="pseudoInput"
                placeholder="ex: rustyrory"
                class="w-full pr-10"
                autofocus
              />
              <!-- Indicateur statut -->
              <div class="absolute right-3 top-1/2 -translate-y-1/2">
                <svg v-if="pseudoStatus === 'checking'" class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <svg v-else-if="pseudoStatus === 'available'" class="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="pseudoStatus === 'taken'" class="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <p v-if="pseudoError" class="text-xs text-red-500">{{ pseudoError }}</p>
            <p v-else-if="pseudoStatus === 'available'" class="text-xs text-green-600">Pseudo disponible !</p>
            <p v-else class="text-xs text-gray-400">2 à 20 caractères, lettres, chiffres, _ et -</p>
          </div>

          <div class="space-y-2 mt-4">
            <label class="text-sm font-medium text-gray-700">Mot de passe</label>
            <UiInput v-model="passwordInput" type="password" placeholder="••••••••" class="w-full" />
          </div>

          <div class="space-y-2 mt-4">
            <label class="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <UiInput v-model="passwordConfirm" type="password" placeholder="••••••••" class="w-full" />
            <p v-if="passwordError" class="text-xs text-red-500">{{ passwordError }}</p>
          </div>
        </div>

        <!-- Étape 2 : Couleur avatar -->
        <div v-else-if="step === 2">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Personnalise ton avatar</h2>
          <p class="text-sm text-gray-500 mb-6">Choisis une couleur pour ton avatar.</p>

          <!-- Aperçu avatar -->
          <div class="flex justify-center mb-6">
            <div :class="[
              'w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md transition-all duration-300',
              selectedColor
            ]">
              {{ getInitial() }}
            </div>
          </div>

          <!-- Palette -->
          <div class="grid grid-cols-4 gap-3">
            <button
              v-for="color in COLORS"
              :key="color.value"
              @click="selectedColor = color.value"
              :title="color.label"
              :class="[
                'relative w-full aspect-square rounded-xl transition-all duration-150',
                color.value,
                selectedColor === color.value
                  ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              ]"
            >
              <svg v-if="selectedColor === color.value" class="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p class="text-center text-xs text-gray-400 mt-3">{{ COLORS.find(c => c.value === selectedColor)?.label }}</p>
        </div>

        <!-- Étape 3 : Récapitulatif -->
        <div v-else>
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Confirme ton profil</h2>
          <p class="text-sm text-gray-500 mb-6">Voici à quoi ressemblera ton profil.</p>

          <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
            <div :class="['w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0', selectedColor]">
              {{ getInitial() }}
            </div>
            <div>
              <p class="font-semibold text-gray-900 text-lg">{{ pseudoInput }}</p>
              <p class="text-sm text-gray-400">Nouveau membre</p>
            </div>
          </div>

          <div class="space-y-2 text-sm mb-6">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Pseudo</span>
              <span class="font-medium text-gray-900">{{ pseudoInput }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Mot de passe</span>
              <span class="font-medium text-gray-900">••••••••</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Couleur</span>
              <span class="flex items-center gap-2">
                <span :class="['w-3 h-3 rounded-full', selectedColor]"></span>
                <span class="font-medium text-gray-900">{{ COLORS.find(c => c.value === selectedColor)?.label }}</span>
              </span>
            </div>
          </div>

          <p v-if="submitError" class="text-xs text-red-500 mb-4">{{ submitError }}</p>
        </div>

        <!-- Boutons navigation -->
        <div class="flex gap-3 mt-8">
          <UiButton
            v-if="step > 1"
            variant="outline"
            class="flex-1"
            @click="goBack"
          >
            ← Retour
          </UiButton>

          <UiButton
            v-if="step < TOTAL_STEPS"
            class="flex-1"
            :disabled="step === 1 && !canGoStep2"
            @click="goNext"
          >
            Continuer →
          </UiButton>

          <UiButton
            v-else
            class="flex-1"
            :disabled="isSubmitting"
            @click="submit"
          >
            {{ isSubmitting ? 'Création...' : 'Créer mon compte' }}
          </UiButton>
        </div>
      </div>

      <!-- Lien vers login -->
      <p class="text-center text-sm text-gray-500 mt-6">
        Déjà un compte ?
        <router-link to="/" class="font-medium text-gray-900 hover:underline">Se connecter</router-link>
      </p>

    </div>
  </div>
</template>
