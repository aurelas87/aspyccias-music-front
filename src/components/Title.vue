<script setup lang="ts">
import TitleIcon from '@/components/TitleIcon.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  class: {
    type: String,
    required: false
  }
})
</script>

<template>
  <h1 v-if="level === 1" class="uppercase text-3xl md:text-5xl mx-auto mb-10 w-fit"
      :class="$props.class">
    <TitleIcon />
    <span class="text-primary">{{ $props.title.slice(0, 1) }}</span>
    <span>{{ $props.title.slice(1) }}</span>
  </h1>

  <h2 v-if="level === 2" class="uppercase text-2xl md:text-3xl mb-3 leading-[83px]">
    <TitleIcon />
    {{ $props.title }}
  </h2>
</template>

<style scoped>

</style>
