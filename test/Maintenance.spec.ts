import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Maintenance from '../src/Maintenance.vue'

describe('Maintenance', () => {
  it('renders properly', () => {
    const wrapper = mount(Maintenance)
    expect(wrapper.text()).toContain('Site web en maintenance')
    expect(wrapper.text()).toContain('Aspyccias sera bientôt de retour avec un site tout beau tout neuf !')
    expect(wrapper.find('img').attributes().alt)
      .toContain('Aspyccias Logo')
  })
})
