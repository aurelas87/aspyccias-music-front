<script setup lang="ts">
import type { PropType, UnwrapRef } from 'vue'
import ReleaseLink from '@/models/Release/ReleaseLink'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fab)

defineProps({
  releaseLink: {
    type: Object as PropType<UnwrapRef<ReleaseLink>>,
    required: true
  }
})
</script>

<template>
  <a :href="$props.releaseLink.link || '#'" target="_blank"
     class="inline-block align-middle hover:text-primary transition-300">
    <FontAwesomeIcon :icon="['fab', $props.releaseLink.name]" class="text-xl mx-1" />
  </a>
</template>

<style scoped>

</style>
