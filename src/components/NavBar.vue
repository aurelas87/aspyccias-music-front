<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import NavLink from '@/components/NavLink.vue'
import LocaleMenu from '@/components/LocaleSwitcher.vue'

const burgerMenuOpen = ref(false)
const toggleBurgerMenu = () => {
  burgerMenuOpen.value = !burgerMenuOpen.value
}
</script>

<template>
  <nav class="hidden sm:block font-bold text-2xl space-x-5">
    <NavLink v-for="route in router.getRoutes()" :route="route" />
    <LocaleMenu />
  </nav>

  <button @click="toggleBurgerMenu"
          class="burger-button sm:hidden fixed top-3 right-3 w-10 h-10 p-2 bg-dark-grey rounded-md space-y-2 box-content"
          :class="{'burger-button-hidden': burgerMenuOpen, 'burger-button-visible': !burgerMenuOpen}">
    <span v-for="number in 3" class="block w-10 h-0.5 bg-white"></span>
  </button>

  <div class="burger-menu sm:hidden fixed top-0 right-0 w-full bg-dark-grey overflow-auto"
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
    </div>
  </div>
</template>

<style scoped>

</style>
