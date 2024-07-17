import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import NavBar from '../../src/components/NavBar.vue'
import { RouterLink } from 'vue-router'
import LocaleSwitcher from '../../src/components/LocaleSwitcher.vue'

function expectRouterLinks(allRouterLinks, expectClassBlock = false) {
  expect(allRouterLinks.length).toBe(4)
  expect(allRouterLinks.at(0).getCurrentComponent().props.to).toBe('/')
  expect(allRouterLinks.at(1).getCurrentComponent().props.to).toBe('/news')
  expect(allRouterLinks.at(2).getCurrentComponent().props.to).toBe('/music')
  expect(allRouterLinks.at(3).getCurrentComponent().props.to).toBe('/contact')

  if (expectClassBlock) {
    allRouterLinks.forEach((element) => {
      expect(element.classes().toString()).toContain('block')
    })
  }
}

describe('NavBar', () => {
  it('renders nav and burger button according to window sizes (desktop vs mobile)', () => {
    const wrapper = mount(NavBar)

    expect(wrapper.find(':not(.burger-menu) nav').classes().toString()).toContain('hidden,sm:block')
    expect(wrapper.find('.burger-button').classes().toString()).toContain('sm:hidden,fixed')
    expect(wrapper.find('.burger-menu').classes().toString()).toContain('sm:hidden,fixed')
  })

  it('renders nav links for desktop', () => {
    const wrapper = mount(NavBar)

    expectRouterLinks(wrapper.find(':not(.burger-menu) nav').findAllComponents(RouterLink))
  })

  it('renders locale switcher', () => {
    const wrapper = mount(NavBar)

    expect(wrapper.findComponent(LocaleSwitcher).isVisible()).toBe(true)
  })

  it('renders nav and locale switcher in burger menu', () => {
    const wrapper = mount(NavBar)

    wrapper.find('.burger-button').trigger('click').then(
      () => {
        expect(wrapper.find('.burger-menu').classes().toString()).toContain('sm:hidden,fixed')
        expect(wrapper.find('.burger-menu button').classes().toString()).toContain('fixed')

        expectRouterLinks(wrapper.find('.burger-menu').findAllComponents(RouterLink), true)

        expect(wrapper.find('.burger-menu').findComponent(LocaleSwitcher).isVisible()).toBe(true)
      }
    )
  })
})
