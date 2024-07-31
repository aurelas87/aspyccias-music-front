<script setup lang="ts">
import { ref } from 'vue'
import { useLocaleStore } from '@/stores/LocaleStore'
import { useI18n } from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { onClickOutside } from '@vueuse/core'
import { updateAxiosLocale, useAxios } from '@/plugins/axios'
import { useEmitter } from '@/plugins/emitter'

const { locale } = useI18n()

const localeStore = useLocaleStore()
const localeMenuOpen = ref(false)

const axios = useAxios()
const emitter = useEmitter()

function localeFullName(locale: string): string {
  return locale === 'en' ? 'English' : 'Français'
}

function switchLocale() {
  localeStore.setLocale(locale.value)
  localeMenuOpen.value = !localeMenuOpen

  updateAxiosLocale(axios, locale.value)
  emitter.emit('localeSwitched')
}

const menuRef = ref()
const ignoreClickOutsideRef = ref()
onClickOutside(
  menuRef,
  () => {
    localeMenuOpen.value = false
  },
  { ignore: [ignoreClickOutsideRef] }
)
</script>

<template>
  <div class="inline relative text-base md:bottom-0.5">
    <a href="#" class="hover:text-primary hover:cursor-pointer transition-300"
          @click.prevent="localeMenuOpen = !localeMenuOpen" ref="ignoreClickOutsideRef">
      <span class="inline-block align-middle">{{ $i18n.locale.toUpperCase() }}</span>
      <FontAwesomeIcon v-if="!localeMenuOpen" :icon="faAngleRight" class="w-2 h-2 inline-block align-middle" />
      <FontAwesomeIcon v-if="localeMenuOpen" :icon="faAngleDown" class="w-2 h-2 inline-block align-middle" />
    </a>

    <div v-if="localeMenuOpen" ref="menuRef"
         class="md:absolute md:top-5 md:left-0 md:text-left md:rounded-sm bg-dark-grey p-3
         w-fit mx-auto space-y-2">
      <label v-for="availableLocale in $i18n.availableLocales" :for="availableLocale"
             class="hover:cursor-pointer hover:text-primary block md:w-max w-full transition-300"
             :class="{'text-primary': $i18n.locale === availableLocale}">
        <input type="radio"
               class="hidden"
               name="lang"
               :id="availableLocale"
               :value="availableLocale"
               v-model="$i18n.locale"
               @change="switchLocale" />
        {{ localeFullName(availableLocale) }} - {{ availableLocale.toUpperCase() }}
      </label>
    </div>
  </div>
</template>

<style scoped>

</style>
