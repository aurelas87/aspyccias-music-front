<script setup lang="ts">
import { computed, type PropType, type UnwrapRef } from 'vue'
import ReleaseTrack from '@/models/Release/ReleaseTrack'

const props = defineProps({
  releaseTrack: {
    type: Object as PropType<UnwrapRef<ReleaseTrack>>,
    required: true
  }
})

const trackPosition = computed(() => {
  if (!props.releaseTrack || !props.releaseTrack.position) {
    return '00'
  }

  return props.releaseTrack.position.toString().padStart(2, '0')
})

const trackDuration = computed(() => {
  if (!props.releaseTrack || !props.releaseTrack.duration) {
    return '00:00'
  }

  const seconds = props.releaseTrack.duration % 60
  const minutes = Math.floor(props.releaseTrack.duration / 60)

  return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
})
</script>

<template>
  <p class="text-md sm:text-xl">
    <span>{{ trackPosition }}.&nbsp;</span>
    <span class="font-bold">{{ $props.releaseTrack.title }}&nbsp;</span>
    <span class="italic">{{ trackDuration }}</span>
  </p>
</template>

<style scoped>

</style>
