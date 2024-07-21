import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FooterView from '../../src/views/FooterView.vue'
import ProfileLinks from '../../src/components/ProfileLinks.vue'

describe('FooterView', () => {
  it('renders footer tag', () => {
    const wrapper = mount(FooterView)

    expect(wrapper.find('footer').isVisible()).toBeTruthy()
  })

  it('renders all profile links', () => {
    const wrapper = mount(FooterView)

    expect(wrapper.findAllComponents(ProfileLinks).length).toStrictEqual(1)
    expect(wrapper.findComponent(ProfileLinks).props().positionStart).toBeUndefined()
    expect(wrapper.findComponent(ProfileLinks).props().positionEnd).toBeUndefined()
  })

  it('renders copyright', () => {
    const wrapper = mount(FooterView)

    expect(wrapper.find('p').text()).toStrictEqual('Copyright © Aspyccias')
  })
})
