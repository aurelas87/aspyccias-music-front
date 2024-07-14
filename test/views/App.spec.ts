import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { RouterView } from 'vue-router'
import App from '../../src/views/App.vue'
import HeaderView from '../../src/views/HeaderView.vue'
import FooterView from '../../src/views/FooterView.vue'

describe('App', () => {
  it('renders header, content and footer', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent(HeaderView).exists()).toBe(true)
    expect(wrapper.findComponent(RouterView).exists()).toBe(true)
    expect(wrapper.findComponent(FooterView).exists()).toBe(true)
  })
})
