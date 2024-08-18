import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref(localStorage.getItem('locale') || '')

  function setLocale(newLocale: string) {
    locale.value = newLocale
    localStorage.setItem('locale', locale.value)
  }

  return { locale, setLocale }
})
