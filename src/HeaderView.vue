<script setup lang="ts">
import { RouterLink } from 'vue-router'

const navItems = [
  {
    'title': 'Home',
    'link': '/',
    'active': true
  },
  {
    'title': 'News',
    'link': '/',
    'active': false
  },
  {
    'title': 'Music',
    'link': '/',
    'active': false
  },
  {
    'title': 'Contact',
    'link': '/',
    'active': false
  }
]
</script>

<template>
  <header class="mb-10">
    <div class="wrapper text-center">
      <img alt="Aspyccias Logo" class="m-5 ml-auto mr-auto" src="@/assets/img/logo-full.png" width="200" />

      <nav class="font-bold text-2xl">
        <RouterLink v-for="navItem in navItems" :to="navItem.link"
                    class="mr-5 ml-5" :class="navItem.active ? ' text-primary' : ''">
          {{ navItem.title }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>
