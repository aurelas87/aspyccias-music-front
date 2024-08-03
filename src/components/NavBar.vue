<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import NavLink from '@/components/NavLink.vue'
import LocaleMenu from '@/components/LocaleSwitcher.vue'
import ProfileLinks from '@/components/ProfileLinks.vue'
import { useLocaleStore } from '@/stores/LocaleStore'

const burgerMenuOpen = ref(false)
const toggleBurgerMenu = () => {
  burgerMenuOpen.value = !burgerMenuOpen.value
}

const localeStore = useLocaleStore()
watch(localeStore.$state, () => {
  burgerMenuOpen.value = false
})
</script>

<template>
  <nav class="hidden md:block font-bold text-2xl space-x-5">
    <NavLink v-for="route in router.getRoutes()" :route="route" />
    <LocaleMenu />
  </nav>

  <button @click="toggleBurgerMenu"
          class="burger-button md:hidden fixed top-3 right-3 w-10 h-10 p-2 bg-dark-grey rounded-custom space-y-2 box-content"
          :class="{'burger-button-hidden': burgerMenuOpen, 'burger-button-visible': !burgerMenuOpen}">
    <span v-for="number in 3" class="block w-10 h-0.5 bg-white"></span>
  </button>

  <div class="burger-menu md:hidden fixed top-0 right-0 h-full bg-dark-grey overflow-auto"
       :class="{ 'burger-menu-closed': !burgerMenuOpen, 'burger-menu-open': burgerMenuOpen }">
    <button @click="toggleBurgerMenu"
            class="fixed top-3 right-3 w-10 h-10 p-2 content-center box-content">
      <span v-for="index in 2"
            class="block relative w-10 h-1 bg-white rounded-full"
            :class="{'rotate-45': index === 1, '-top-1 -rotate-45': index === 2}"
      ></span>
    </button>

    <div class="relative top-14">
      <NavLink v-for="route in router.getRoutes()"
               :route="route"
               :class="'block text-4xl p-3'"
               :click="toggleBurgerMenu" />
      <LocaleMenu />

      <ProfileLinks :position-start="1" :position-end="4" class="pt-5"/>
    </div>
  </div>
</template>

<style scoped>

</style>
