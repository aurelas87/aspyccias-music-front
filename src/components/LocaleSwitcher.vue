<script setup lang="ts">
import { ref } from 'vue'
import { useLocaleStore } from '@/stores/LocaleStore'
import { useI18n } from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { onClickOutside } from '@vueuse/core'

const { locale } = useI18n()

const localeStore = useLocaleStore()
const localeMenuOpen = ref(false)

function localeFullName(locale: string): string {
  return locale === 'en' ? 'English' : 'Français'
}

function switchLocale() {
  localeStore.setLocale(locale.value)
  localeMenuOpen.value = !localeMenuOpen
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
  <div class="inline relative text-base sm:bottom-0.5">
    <span class="hover:text-primary hover:cursor-pointer"
          @click.prevent="localeMenuOpen = !localeMenuOpen" ref="ignoreClickOutsideRef">
      <span class="inline-block align-middle">{{ $i18n.locale.toUpperCase() }}</span>
      <FontAwesomeIcon v-if="!localeMenuOpen" :icon="faAngleRight" class="w-2 h-2 inline-block align-middle" />
      <FontAwesomeIcon v-if="localeMenuOpen" :icon="faAngleDown" class="w-2 h-2 inline-block align-middle" />
    </span>

    <div v-if="localeMenuOpen" ref="menuRef"
         class="sm:absolute sm:top-5 sm:left-0 sm:text-left sm:rounded-md bg-dark-grey p-3
         w-fit mx-auto space-y-2">
      <label v-for="availableLocale in $i18n.availableLocales" :for="availableLocale"
             class="hover:cursor-pointer hover:text-primary block sm:w-max w-full"
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
