<script setup lang="ts">
import Title from '@/components/Title.vue'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

if (!userStore.isConnected()) {

}
</script>

<template>
  <main>
    <Title title="Profile" :level="1" />
  </main>
</template>

<style scoped>

</style>
