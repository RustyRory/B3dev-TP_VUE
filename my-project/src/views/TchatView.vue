<script setup>
import { watch } from "vue"
import { isLogged, isLoading } from "../config/authVariables.js"
import { useRouter } from "vue-router"

import UserList from "../components/UserList.vue"
import ChatBox from "../components/ChatBox.vue"

const router = useRouter()

watch([isLogged, isLoading], ([logged, loading]) => {
  if (!loading && !logged) router.push("/")
})
</script>

<template>
  <div style="display:flex; height:80vh;">

    <!-- 👤 Liste utilisateurs -->
    <div style="width:30%; border-right:1px solid #ccc; padding:10px;">
      <UserList />
    </div>

    <!-- 💬 Chat -->
    <div style="flex:1; padding:10px;">
      <ChatBox />
    </div>

  </div>
</template>