<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderView from '@/views/HeaderView.vue'
import FooterView from '@/views/FooterView.vue'
import { updateAxiosLocale, useAxios } from '@/plugins/axios'
import { useLocaleStore } from '@/stores/LocaleStore'

const axios = useAxios()
updateAxiosLocale(axios, useLocaleStore().locale)
</script>

<template>
  <div class="flex flex-col h-screen min-w-[300px] px-10 sm:px-20 md:px-32 mx-auto">
    <HeaderView />
    <RouterView class="flex flex-col flex-grow my-3 md:my-10" />
    <FooterView />
  </div>
</template>

<style scoped>
</style>
