import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FooterView from '../../src/views/FooterView.vue'

describe('FooterView', () => {
  it('renders footer tag', () => {
    const wrapper = mount(FooterView)

    expect(wrapper.find('footer').isVisible()).toBe(true)
  })

  it('renders copyright', () => {
    const wrapper = mount(FooterView)

    expect(wrapper.find('p').text()).toBe('Copyright © Aspyccias')
  })
})
