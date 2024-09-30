<script setup lang="ts">
import Title from '@/components/Title.vue'
import { useProfileService } from '@/services/ProfileService'
import { useProfileMapper } from '@/mappers/Profile/ProfileMapper'
import { onMounted, reactive } from 'vue'
import Profile from '@/models/Profile/Profile'

const profileService = useProfileService()
const profileMapper = useProfileMapper()

const profile = reactive<Profile>(new Profile())

onMounted(async () => {
  const profileResponse = await profileService.get().then(r => r)
  profileMapper.mapResponseToProfile(profileResponse, profile)
})
</script>

<template>
  <main>
    <Title title="Profile" :level="1" />
  </main>
</template>

<style scoped>

</style>
