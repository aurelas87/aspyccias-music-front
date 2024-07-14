<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <header class="text-center">
    <RouterLink to="/" class="block w-fit my-5 mx-auto px-3">
      <img alt="Aspyccias Logo" src="@/assets/img/logo-full-200.png" width="200" />
    </RouterLink>

    <NavBar />
  </header>
</template>

<style scoped>

</style>
