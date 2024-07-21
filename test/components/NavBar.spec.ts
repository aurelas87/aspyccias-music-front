import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import NavBar from '../../src/components/NavBar.vue'
import { RouterLink } from 'vue-router'
import LocaleSwitcher from '../../src/components/LocaleSwitcher.vue'
import ProfileLinks from '../../src/components/ProfileLinks.vue'

function expectRouterLinks(allRouterLinks, expectClassBlock = false) {
  expect(allRouterLinks.length).toStrictEqual(4)
  expect(allRouterLinks.at(0).getCurrentComponent().props.to).toStrictEqual('/')
  expect(allRouterLinks.at(1).getCurrentComponent().props.to).toStrictEqual('/news')
  expect(allRouterLinks.at(2).getCurrentComponent().props.to).toStrictEqual('/music')
  expect(allRouterLinks.at(3).getCurrentComponent().props.to).toStrictEqual('/contact')

  if (expectClassBlock) {
    allRouterLinks.forEach((element) => {
      expect(element.classes().toString()).toContain('block')
    })
  }
}

describe('NavBar', () => {
  it('renders nav and burger button according to window sizes (desktop vs mobile)', () => {
    const wrapper = mount(NavBar)

    expect(wrapper.find(':not(.burger-menu) nav').classes().toString()).toContain('hidden,md:block')
    expect(wrapper.find('.burger-button').classes().toString()).toContain('md:hidden,fixed')
    expect(wrapper.find('.burger-menu').classes().toString()).toContain('md:hidden,fixed')
  })

  it('renders nav links for desktop', () => {
    const wrapper = mount(NavBar)

    expectRouterLinks(wrapper.find(':not(.burger-menu) nav').findAllComponents(RouterLink))
  })

  it('renders locale switcher', () => {
    const wrapper = mount(NavBar)

    const LocaleSwitcherComponents = wrapper.findAllComponents(LocaleSwitcher)
    expect(LocaleSwitcherComponents.length).toStrictEqual(2)
    expect(LocaleSwitcherComponents.at(0).element.parentElement.getAttribute('class')).toContain('md:block')
    expect(LocaleSwitcherComponents.at(1).element.parentElement.parentElement.getAttribute('class')).toContain('burger-menu')
  })

  it('renders nav and locale switcher in burger menu', () => {
    const wrapper = mount(NavBar)

    wrapper.find('.burger-button').trigger('click').then(
      () => {
        expect(wrapper.find('.burger-menu').classes().toString()).toContain('md:hidden,fixed')
        expect(wrapper.find('.burger-menu button').classes().toString()).toContain('fixed')

        expectRouterLinks(wrapper.find('.burger-menu').findAllComponents(RouterLink), true)

        expect(wrapper.find('.burger-menu').findAllComponents(LocaleSwitcher).length).toStrictEqual(1)
        expect(wrapper.find('.burger-menu').findComponent(LocaleSwitcher).isVisible()).toBeTruthy()
      }
    )
  })

  it('renders the first 4 profile links in burger menu', () => {
    const wrapper = mount(NavBar)

    const profileLinksComponents = wrapper.findAllComponents(ProfileLinks)
    expect(profileLinksComponents.length).toStrictEqual(1)
    expect(profileLinksComponents.at(0).props().positionStart).toStrictEqual(1)
    expect(profileLinksComponents.at(0).props().positionEnd).toStrictEqual(4)
  })
})
