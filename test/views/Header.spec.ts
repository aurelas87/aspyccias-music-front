import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HeaderView from '../../src/views/HeaderView.vue'
import NavBar from '../../src/components/NavBar.vue'
import { RouterLink } from 'vue-router'
import ProfileLinks from '../../src/components/ProfileLinks.vue'

describe('HeaderView', () => {
  it('renders header tag', () => {
    const wrapper = mount(HeaderView)

    expect(wrapper.find('header').isVisible()).toBeTruthy()
  })

  it('renders logo with link to Home', () => {
    const wrapper = mount(HeaderView)

    const expectedLogo = wrapper.find('header img')
    expect(expectedLogo.attributes().src).toContain('logo-full-200.png')
    expect(expectedLogo.attributes().alt).toContain('Aspyccias Logo')
    expect(expectedLogo.getCurrentComponent().type.name).toStrictEqual(RouterLink.name)
    expect(expectedLogo.element.parentElement.getAttribute('href')).toStrictEqual('/')
  })

  it('renders nav bar', () => {
    const wrapper = mount(HeaderView)
    expect(wrapper.findAllComponents(NavBar).length).toStrictEqual(1)
  })

  it('renders the first 4 profile links', () => {
    const wrapper = mount(HeaderView)
    const profileLinksComponents = wrapper.findAllComponents(ProfileLinks)
    expect(profileLinksComponents.length).toStrictEqual(3)

    profileLinksComponents.forEach((profileLinksComponent, index) => {
      expect(profileLinksComponent.isVisible()).toBeTruthy()

      if (index === 0) {
        expect(profileLinksComponent.getCurrentComponent().parent.type.__name).toStrictEqual('HeaderView')
        expect(profileLinksComponent.props().positionStart).toStrictEqual(1)
        expect(profileLinksComponent.props().positionEnd).toStrictEqual(2)
      }

      if (index === 1) {
        expect(profileLinksComponent.getCurrentComponent().parent.type.__name).toStrictEqual('HeaderView')
        expect(profileLinksComponent.props().positionStart).toStrictEqual(3)
        expect(profileLinksComponent.props().positionEnd).toStrictEqual(4)
      }

      if (index === 2) {
        expect(profileLinksComponent.getCurrentComponent().parent.type.__name).toStrictEqual('NavBar')
      }
    })
  })
})
