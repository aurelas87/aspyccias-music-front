<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderView from '@/HeaderView.vue'
import FooterView from '@/FooterView.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <HeaderView class="p-3 pb-0" />
    <RouterView class="flex flex-col flex-grow pl-3 pr-3" />
    <FooterView class="p-3 pt-0" />
  </div>
</template>

<style scoped>
</style>
