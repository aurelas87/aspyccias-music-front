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

  <button v-if="!burgerMenuOpen"
          @click="toggleBurgerMenu"
          class="sm:hidden fixed top-3 right-3 w-10 h-10 p-2 bg-dark-grey rounded-md space-y-2 box-content">
    <span v-for="number in 3" class="block w-10 h-0.5 bg-white"></span>
  </button>

  <div v-if="burgerMenuOpen" class="sm:hidden fixed top-0 left-0 w-full h-full bg-dark-grey overflow-auto">
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
