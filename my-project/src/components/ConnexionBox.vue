<script setup>
import { ref, onMounted, getCurrentInstance } from "vue"
import { isLogged, pseudo, isLoading } from "../store/auth"
import { config } from "../config/config.js" // 🌟 Import config pour l'API

const { proxy } = getCurrentInstance()

onMounted(async () => {
  try {
    const res = await fetch(`${config.apiUrl}/auth/me`, {
      credentials: "include"
    })

    if (res.ok) {
      const data = await res.json()
      pseudo.value = data.pseudo
      isLogged.value = true
    }
  } catch (e) {
    console.log("Pas connecté")
  } finally {
    isLoading.value = false
  }
})

const login = async () => {
  if (!pseudo.value) return

  const res = await fetch(`${config.apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include", // 🔥 important pour les cookies
    body: JSON.stringify({ pseudo: pseudo.value })
  })

  if (res.ok) {
    isLogged.value = true
  }
}

const logout = async () => {
  await fetch(`${config.apiUrl}/auth/logout`, { 
    method: "POST", 
    credentials: "include" 
  })
  pseudo.value = ""
  isLogged.value = false
  window.location.href = "/" // ⚡ refresh / redirection immédiate
}
</script>

<template>
  <div>
    <div v-if="isLoading">
      Chargement...
    </div>

    <div v-else>
      <div v-if="!isLogged">
        <h3>Connexion</h3>
        <input v-model="pseudo" placeholder="Votre pseudo" />
        <button @click="login">Se connecter</button>
      </div>

      <div v-else>
        <h3>Bienvenue {{ pseudo }}</h3>
        <button @click="logout">Se déconnecter</button>
      </div>
    </div>
  </div>
</template>