import { describe, it, expect, beforeEach } from 'vitest'
import { isLogged, pseudo, isLoading } from '../config/authVariables'

describe('authVariables', () => {
  beforeEach(() => {
    isLogged.value = false
    pseudo.value = ''
    isLoading.value = true
  })

  it('isLogged est false par défaut', () => {
    expect(isLogged.value).toBe(false)
  })

  it('pseudo est vide par défaut', () => {
    expect(pseudo.value).toBe('')
  })

  it('isLoading est true par défaut', () => {
    expect(isLoading.value).toBe(true)
  })

  it('isLogged peut être mis à true', () => {
    isLogged.value = true
    expect(isLogged.value).toBe(true)
  })

  it('pseudo peut être modifié', () => {
    pseudo.value = 'alice'
    expect(pseudo.value).toBe('alice')
  })

  it('isLoading peut passer à false', () => {
    isLoading.value = false
    expect(isLoading.value).toBe(false)
  })
})
