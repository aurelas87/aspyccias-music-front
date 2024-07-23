<script setup lang="ts">
import { useImage } from '@/composables/image'
import { useAxios } from '@/plugins/axios'
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import { useProfileService } from '@/services/ProfileService'
import { useEmitter } from '@/plugins/emitter'

const { onImageError } = useImage()

const emitter = useEmitter()
const axios = useAxios()
const profileService = useProfileService()

const profile = reactive<Profile>({
  welcome: '',
  description: ''
})

async function fetchProfile() {
  const fetchedProfile = await profileService.get().then((response) => response)
  profile.welcome = fetchedProfile?.welcome || ''
  profile.description = fetchedProfile?.description || ''
}

onMounted(async () => {
  await fetchProfile()

  emitter.on('localeSwitched', () => {
    fetchProfile().then(r => r)
  })
})

onBeforeUnmount(() => {
  emitter.off('localeSwitched')
})
</script>

<template>
  <main>
    <div class="text-center text-2xl mb-10">
      <p>{{ profile.welcome }}</p>
    </div>

    <div class="bg-primary/50 py-3 px-5 sm:py-10 sm:px-20 rounded-md">
      <div class="mx-auto sm:float-left w-fit h-fit mr-5 mb-5 sm:mr-20 sm:mb-10 border-2 rounded-md">
        <img :src="axios.getUri({ url: '/uploads/profile/profile-picture.jpg' })"
             alt="Aspyccias profile picture"
             width="400" height="484"
             class="relative top-5 left-5 rounded-md"
             @error="onImageError" />
      </div>

      <div class="text-justify">
        <h2>{{ $t('home.about') }}</h2>

        <div>{{ profile.description }}</div>
      </div>
    </div>
  </main>
</template>
