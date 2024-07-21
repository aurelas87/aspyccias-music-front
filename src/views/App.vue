<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderView from '@/views/HeaderView.vue'
import FooterView from '@/views/FooterView.vue'
</script>

<template>
  <div class="flex flex-col h-screen max-w-[80%] mx-auto">
    <HeaderView />
    <RouterView class="flex flex-col flex-grow my-3 md:my-10" />
    <FooterView />
  </div>
</template>

<style scoped>
</style>
