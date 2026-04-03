<script setup>
import ConnexionBox from "./ConnexionBox.vue"
import { isLogged, isLoading } from "../config/authVariables.js"
</script>

<template>
    <nav class="navbar">
    <div class="nav-left">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      
      <router-link v-if="!isLoading && isLogged" to="/datatable">DataTable</router-link>

      <router-link v-if="!isLoading && isLogged" to="/tchat">Tchat</router-link>
    </div>

    <div class="nav-right">
      <ConnexionBox />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between; /* gauche / droite */
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
}

.nav-left a {
  margin-right: 15px;
  /* text-decoration: none;
  color: black; */
}

.nav-right {
  display: flex;
  align-items: center;
}
</style>