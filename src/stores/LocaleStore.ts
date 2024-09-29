import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useLocaleStore = defineStore('locale', () => {
  const locale = useStorage('locale', '')

  function setLocale(newLocale: string) {
    locale.value = newLocale
  }

  return { locale, setLocale }
})
