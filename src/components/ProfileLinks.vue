<script setup lang="ts">
import { useProfileLinksStore } from '@/stores/ProfileLinksStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { reactive, type UnwrapRef, watch } from 'vue'
import type ProfileLink from '@/models/Profile/ProfileLink'

library.add(fab)

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

async function updateProfileLinksRef() {
  profileLinks.splice(0)

  for (const profileLink of getProfileLinks()) {
    profileLinks.push(profileLink)
  }
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
