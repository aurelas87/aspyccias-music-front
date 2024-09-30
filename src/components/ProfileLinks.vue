<script setup lang="ts">
import { useProfileLinksStore } from '@/stores/ProfileLinksStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook'
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube'
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify'
import { faDeezer } from '@fortawesome/free-brands-svg-icons/faDeezer'
import { faBandcamp } from '@fortawesome/free-brands-svg-icons/faBandcamp'
import { faApple } from '@fortawesome/free-brands-svg-icons/faApple'
import { faAmazon } from '@fortawesome/free-brands-svg-icons/faAmazon'
import { faNapster } from '@fortawesome/free-brands-svg-icons/faNapster'
import { reactive, type UnwrapRef, watch } from 'vue'
import type ProfileLink from '@/models/Profile/ProfileLink'

library.add(faFacebook)
library.add(faInstagram)
library.add(faYoutube)
library.add(faSpotify)
library.add(faDeezer)
library.add(faBandcamp)
library.add(faApple)
library.add(faAmazon)
library.add(faNapster)

const props = defineProps<{
  positionStart?: number,
  positionEnd?: number
}>()

const profileLinksStore = useProfileLinksStore()
const profileLinks = reactive<ProfileLink[]>([])

function getProfileLinks(): UnwrapRef<ProfileLink>[] {
  return (!props.positionStart || !props.positionEnd)
    ? profileLinksStore.profileLinks
    : profileLinksStore.getProfileLinksInPositionRange(props.positionStart, props.positionEnd)
}

function updateProfileLinksRef() {
  profileLinks.splice(0)

  getProfileLinks().forEach((profileLink: UnwrapRef<ProfileLink>) => {
    profileLinks.push(profileLink)
  })
}

updateProfileLinksRef()
watch(profileLinksStore.$state.profileLinks, updateProfileLinksRef)
</script>

<template>
  <div>
    <a v-for="profileLink in profileLinks" :href="profileLink.link || undefined" target="_blank">
      <FontAwesomeIcon :icon="['fab', profileLink.name]" class="px-2 text-4xl hover:text-primary transition-300" />
    </a>
  </div>
</template>

<style scoped>

</style>
