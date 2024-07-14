import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HeaderView from '../../src/views/HeaderView.vue'
import NavBar from '../../src/components/NavBar.vue'
import { RouterLink } from 'vue-router'

describe('HeaderView', () => {
  it('renders header tag', () => {
    const wrapper = mount(HeaderView)

    expect(wrapper.find('header').isVisible()).toBe(true)
  })

  it('renders logo with link to Home', () => {
    const wrapper = mount(HeaderView)

    const expectedLogo = wrapper.find('header img')
    expect(expectedLogo.attributes().src).toContain('logo-full-200.png')
    expect(expectedLogo.attributes().alt).toContain('Aspyccias Logo')
    expect(expectedLogo.getCurrentComponent().type.name).toBe(RouterLink.name)
    expect(expectedLogo.element.parentElement.getAttribute('href')).toBe('/')
  })

  it('renders nav bar', () => {
    const wrapper = mount(HeaderView)
    expect(wrapper.findComponent(NavBar).isVisible()).toBe(true)
  })
})
