import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { config } from '@vue/test-utils'
import router from '../src/router'

const pinia = createPinia()

const i18n = createI18n({
  availableLocales: ['en', 'fr'],
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    en: {},
    fr: {}
  }
})

config.global.plugins = [pinia, i18n, router]
config.global.mocks.$t = (key: string) => key
config.global.mocks.useI18n = { locale: 'en' }
