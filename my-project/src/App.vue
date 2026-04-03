<script setup>
import Navbar from "./components/NavBar.vue"
</script>

<template>
  <Navbar />

  <main style="padding:20px">
    <router-view />
  </main>
</template>
