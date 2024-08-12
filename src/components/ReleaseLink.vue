<script setup lang="ts">
import type { PropType, UnwrapRef } from 'vue'
import ReleaseLink from '@/models/Release/ReleaseLink'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube'
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify'
import { faDeezer } from '@fortawesome/free-brands-svg-icons/faDeezer'
import { faBandcamp } from '@fortawesome/free-brands-svg-icons/faBandcamp'
import { faApple } from '@fortawesome/free-brands-svg-icons/faApple'
import { faAmazon } from '@fortawesome/free-brands-svg-icons/faAmazon'

library.add(faYoutube)
library.add(faSpotify)
library.add(faDeezer)
library.add(faBandcamp)
library.add(faApple)
library.add(faAmazon)

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
