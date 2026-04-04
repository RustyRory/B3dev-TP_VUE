import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'

// Router minimal pour éviter les warnings vue-router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
})

describe('App', () => {
  it('se monte sans erreur', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router] }
    })
    await router.isReady()
    expect(wrapper.exists()).toBe(true)
  })

  it('contient la classe min-h-screen', async () => {
    const wrapper = mount(App, {
      global: { plugins: [router] }
    })
    await router.isReady()
    expect(wrapper.find('div').classes()).toContain('min-h-screen')
  })
})
