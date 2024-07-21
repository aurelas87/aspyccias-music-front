import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'

import ProfileLinks from '../../src/components/ProfileLinks.vue'
import { useProfileLinksStore } from '../../src/stores/ProfileLinksStore'
import { addProfileLinks } from '../fixtures/ProfileLinkFixtures'

describe('ProfileLinks', () => {
  beforeAll(() => {
    addProfileLinks()
  })

  it('renders all profile links', () => {
    const wrapper = mount(ProfileLinks)

    const links = wrapper.findAll('a')
    expect(links.length).toStrictEqual(5)
  })

  it('renders profile links according to props', () => {
    const wrapper = mount(ProfileLinks, {
      props: {
        positionStart: 2,
        positionEnd: 4
      }
    })


    const links = wrapper.findAll('a')
    expect(links.length).toStrictEqual(3)
  })

  it('renders nothing if no profile links', () => {
    useProfileLinksStore().$reset()

    const wrapper = mount(ProfileLinks)
    expect(wrapper.findAll('a').length).toStrictEqual(0)
  })
})
