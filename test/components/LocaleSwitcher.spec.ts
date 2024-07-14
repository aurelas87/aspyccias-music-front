import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LocaleSwitcher from '../../src/components/LocaleSwitcher.vue'

describe('LocaleSwitcher', () => {
  it('renders locale switcher menu closed', () => {
    const wrapper = mount(LocaleSwitcher)

    expect(wrapper.find('div').classes().toString()).toContain('inline,relative')
    expect(wrapper.find('div span span').text()).toBe('EN')
    expect(wrapper.findAll('div span svg').length).toBe(1)
    expect(wrapper.find('div span svg').classes().toString()).toContain('fa-angle-right')
    expect(wrapper.find({ ref: 'menuRef' }).exists()).toBe(false)
  })

  it('renders locale switcher menu open on click', () => {
    const wrapper = mount(LocaleSwitcher)

    wrapper.find({ ref: 'ignoreClickOutsideRef' }).trigger('click').then(
      () => {
        expect(wrapper.findAll('div span svg').length).toBe(1)
        expect(wrapper.find('div span svg').classes().toString()).toContain('fa-angle-down')

        expect(wrapper.find({ ref: 'menuRef' }).exists()).toBe(true)

        const localeLabels = wrapper.find({ ref: 'menuRef' }).findAll('label')
        expect(localeLabels.length).toBe(2)

        expect(localeLabels[0].text()).toBe('English - EN')
        expect(localeLabels[0].find('input').element.value).toBe('en')
        expect(localeLabels[0].find('input').element.checked).toBe(true)

        expect(localeLabels[1].text()).toBe('Français - FR')
        expect(localeLabels[1].find('input').element.value).toBe('fr')
        expect(localeLabels[1].find('input').element.checked).toBe(false)
      }
    )
  })

  it('renders locale switcher menu closed on language change', () => {
    const wrapper = mount(LocaleSwitcher)

    wrapper.find({ ref: 'ignoreClickOutsideRef' }).trigger('click').then(
      () => {
        wrapper.findAll('label')[1].find('input').trigger('change').then(
          () => {
            expect(wrapper.find('div span span').text()).toBe('FR')
            expect(wrapper.findAll('div span svg').length).toBe(1)
            expect(wrapper.find('div span svg').classes().toString()).toContain('fa-angle-right')
            expect(wrapper.find({ ref: 'menuRef' }).exists()).toBe(false)


            wrapper.find({ ref: 'ignoreClickOutsideRef' }).trigger('click').then(
              () => {
                const localeLabels = wrapper.find({ ref: 'menuRef' }).findAll('label')

                expect(localeLabels[0].find('input').element.checked).toBe(false)
                expect(localeLabels[1].find('input').element.checked).toBe(true)
              }
            )
          }
        )
      }
    )
  })
})
