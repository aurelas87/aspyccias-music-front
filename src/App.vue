<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="mb-10">
    <div class="wrapper text-center">
      <img alt="Aspyccias logo" class="m-5 ml-auto mr-auto" src="@/assets/img/logo-full.png" width="200" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
