import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../components/ui/Button.vue'

describe('Button', () => {
  it('affiche le slot', () => {
    const wrapper = mount(Button, { slots: { default: 'Envoyer' } })
    expect(wrapper.text()).toBe('Envoyer')
  })

  it('applique le variant default', () => {
    const wrapper = mount(Button, { props: { variant: 'default' } })
    expect(wrapper.classes()).toContain('bg-gray-900')
  })

  it('applique le variant outline', () => {
    const wrapper = mount(Button, { props: { variant: 'outline' } })
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('bg-white')
  })

  it('applique le variant destructive', () => {
    const wrapper = mount(Button, { props: { variant: 'destructive' } })
    expect(wrapper.classes()).toContain('bg-red-600')
  })

  it('applique la taille sm', () => {
    const wrapper = mount(Button, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('h-8')
  })

  it('applique la taille lg', () => {
    const wrapper = mount(Button, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('h-11')
  })

  it('est désactivé quand disabled=true', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('disabled:opacity-50')
  })

  it('émet un click', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('le type par défaut est button', () => {
    const wrapper = mount(Button)
    expect(wrapper.attributes('type')).toBe('button')
  })
})
