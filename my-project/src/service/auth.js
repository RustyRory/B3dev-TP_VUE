// utils/auth.js
import { isLoading, isLogged } from "../store/auth"
import { watch } from "vue"

export const awaitAuth = () =>
  new Promise((resolve) => {
    if (!isLoading.value) return resolve(isLogged.value)
    const unwatch = watch(isLoading, (loading) => {
      if (!loading) {
        unwatch()
        resolve(isLogged.value)
      }
    })
  })