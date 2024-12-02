<script setup lang="ts">
import Title from '@/components/Title.vue'
import Loader from '@/components/Loader.vue'
import AdminReleaseDetails from '@/models/Release/AdminReleaseDetails.ts'
import { computed, reactive, ref } from 'vue'

const loading = ref(false)

const adminReleaseDetails = reactive<AdminReleaseDetails>(new AdminReleaseDetails())

const title = computed(() => {
  return 'Edit "' + adminReleaseDetails.title + '" credits'
})
</script>

<template>
  <transition appear>
    <div>
      <Title :title="title" :level="1" />

      <Loader :loading="loading" />
    </div>
  </transition>
</template>

<style scoped>

</style>
