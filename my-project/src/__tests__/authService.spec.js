import { describe, it, expect, beforeEach } from 'vitest'
import { isLogged, isLoading } from '../config/authVariables'
import { awaitAuth } from '../service/authService'

describe('awaitAuth', () => {
  beforeEach(() => {
    isLogged.value = false
    isLoading.value = false
  })

  it('résout immédiatement si isLoading est false', async () => {
    isLogged.value = true
    isLoading.value = false
    const result = await awaitAuth()
    expect(result).toBe(true)
  })

  it('retourne false si non connecté et isLoading false', async () => {
    isLogged.value = false
    isLoading.value = false
    const result = await awaitAuth()
    expect(result).toBe(false)
  })

  it('attend la fin du chargement avant de résoudre', async () => {
    isLogged.value = true
    isLoading.value = true

    // Résoudre après un tick
    setTimeout(() => {
      isLoading.value = false
    }, 10)

    const result = await awaitAuth()
    expect(result).toBe(true)
  })
})
