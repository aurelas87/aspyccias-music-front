import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import Vue3Toastify, { toast } from 'vue3-toastify'
import type { ToastContainerOptions } from 'vue3-toastify'

import axios from '@/plugins/axios'
import emitter from '@/plugins/emitter'
import router from './router'

import { useLocaleStore } from '@/stores/LocaleStore'
import { useProfileLinksStore } from '@/stores/ProfileLinksStore'

import Maintenance from '@/views/Maintenance.vue'
import App from '@/views/App.vue'

// Import translations
import en from './locales/en.json'
import fr from './locales/fr.json'

const app = (import.meta.env.MODE === 'maintenance')
  ? createApp(Maintenance)
  : createApp(App)

if (import.meta.env.mode !== 'maintenance') {
  app.use(emitter)
  app.use(axios, {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  })

  app.use(createPinia())

  const localeStore = useLocaleStore()
  if (!localeStore.locale) {
    localeStore.setLocale(navigator.language.split('-')[0].trim() || 'en');
  }

  const i18n = createI18n({
    availableLocales: ['en', 'fr'],
    locale: localeStore.locale,
    fallbackLocale: 'en',
    messages: { en, fr },
    legacy: false,
    datetimeFormats: {
      en: {
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      },
      fr: {
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      }
    }
  })

  app.use(i18n)
  app.use(router)

  app.use(
    Vue3Toastify,
    {
      autoClose: 5000,
      position: toast.POSITION.BOTTOM_RIGHT,
      transition: toast.TRANSITIONS.FLIP,
      theme: toast.THEME.DARK,
      bodyClassName: 'font-sans',
    } as ToastContainerOptions
  )
}

app.mount('#app')

if (import.meta.env.mode !== 'maintenance') {
  const profileLinksStore = useProfileLinksStore()
  profileLinksStore.fetchProfileLinks().then(r => r)
}
