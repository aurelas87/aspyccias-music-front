import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LocaleSwitcher from '../../src/components/LocaleSwitcher.vue'

describe('LocaleSwitcher', () => {
  it('renders locale switcher menu closed', () => {
    const wrapper = mount(LocaleSwitcher)

    expect(wrapper.find('div').classes().toString()).toContain('inline,relative')
    expect(wrapper.find('div a span').text()).toStrictEqual('EN')
    expect(wrapper.findAll('div a svg').length).toStrictEqual(1)
    expect(wrapper.find('div a svg').classes().toString()).toContain('fa-angle-right')
    expect(wrapper.find({ ref: 'menuRef' }).exists()).toBeFalsy()
  })

  it('renders locale switcher menu open on click', () => {
    const wrapper = mount(LocaleSwitcher)

    wrapper.find({ ref: 'ignoreClickOutsideRef' }).trigger('click').then(
      () => {
        expect(wrapper.findAll('div a svg').length).toStrictEqual(1)
        expect(wrapper.find('div a svg').classes().toString()).toContain('fa-angle-down')

        expect(wrapper.find({ ref: 'menuRef' }).exists()).toBeTruthy()

        const localeLabels = wrapper.find({ ref: 'menuRef' }).findAll('label')
        expect(localeLabels.length).toStrictEqual(2)

        expect(localeLabels[0].text()).toStrictEqual('English - EN')
        expect(localeLabels[0].find('input').element.value).toStrictEqual('en')
        expect(localeLabels[0].find('input').element.checked).toBeTruthy()

        expect(localeLabels[1].text()).toStrictEqual('Français - FR')
        expect(localeLabels[1].find('input').element.value).toStrictEqual('fr')
        expect(localeLabels[1].find('input').element.checked).toBeFalsy()
      }
    )
  })

  it('renders locale switcher menu closed on language change', () => {
    const wrapper = mount(LocaleSwitcher)

    wrapper.find({ ref: 'ignoreClickOutsideRef' }).trigger('click').then(
      () => {
        wrapper.findAll('label')[1].find('input').trigger('change').then(
          () => {
            expect(wrapper.find('div a span').text()).toStrictEqual('FR')
            expect(wrapper.findAll('div a svg').length).toStrictEqual(1)
            expect(wrapper.find('div a svg').classes().toString()).toContain('fa-angle-right')
            expect(wrapper.find({ ref: 'menuRef' }).exists()).toBeFalsy()


            wrapper.find({ ref: 'ignoreClickOutsideRef' }).trigger('click').then(
              () => {
                const localeLabels = wrapper.find({ ref: 'menuRef' }).findAll('label')

                expect(localeLabels[0].find('input').element.checked).toBeFalsy()
                expect(localeLabels[1].find('input').element.checked).toBeTruthy()
              }
            )
          }
        )
      }
    )
  })
})
