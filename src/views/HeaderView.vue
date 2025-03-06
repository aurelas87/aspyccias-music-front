<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import ProfileLinks from '@/components/ProfileLinks.vue'
</script>

<template>
  <header class="mx-auto">
    <div class="w-max mx-auto md:grid md:grid-flow-col">
      <ProfileLinks :position-start="1" :position-end="2" class="hidden md:flex w-max text-right items-end mb-5 md:mr-10" />

      <div class="mx-auto">
        <RouterLink to="/" class="w-fit my-5 px-3">
          <img alt="Aspyccias Logo" src="@/assets/img/logo-full-200.png" width="200" height="144" class="max-w-[200px] max-h-[144px]" />
        </RouterLink>
      </div>

      <ProfileLinks :position-start="3" :position-end="4" class="hidden md:flex w-max text-left items-end mb-5 md:ml-10" />
    </div>

    <NavBar />
  </header>
</template>

<style scoped>

</style>
