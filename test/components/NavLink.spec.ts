import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import NavLink from '../../src/components/NavLink.vue'
import router from '../../src/router'

const dataProviderNavLinks = [
  { route: router.getRoutes()[0], class: 'route-0' },
  { route: router.getRoutes()[1], class: 'route-1' },
  { route: router.getRoutes()[2], class: 'route-2' },
  { route: router.getRoutes()[3], class: 'route-3' }
]

describe('NavLink', () => {
  describe.each(dataProviderNavLinks)('renders nav link', (navLink) => {
    it(`Case ${navLink.route.name.toString()}`, () => {
      const wrapper = mount(NavLink, {
        props: {
          route: navLink.route,
          class: navLink.class
        }
      })

      expect(wrapper.find('a').element.getAttribute('href')).toBe(navLink.route.path)
      expect(wrapper.find('a').classes().toString()).toContain(navLink.class)
      expect(wrapper.find('a').text()).toBe(navLink.route.name.toString())
    })
  })
})
