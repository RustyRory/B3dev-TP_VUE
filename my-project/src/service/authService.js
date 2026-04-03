// utils/auth.js
import { isLoading, isLogged } from "../config/authVariables"
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