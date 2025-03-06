<script setup lang="ts">
import Title from '@/components/Title.vue'
import FormTable from '@/components/FormTable.vue'
import Loader from '@/components/Loader.vue'
import { useProfileLinkService } from '@/services/ProfileLinkService'
import { onMounted, onUnmounted, ref } from 'vue'
import { useEmitter } from '@/plugins/emitter'
import { useProfileLinksStore } from '@/stores/ProfileLinksStore'
import type { TableHeaders } from '@/types/admin/Commons'

const profileLinKService = useProfileLinkService()
const emitter = useEmitter()
const profileLinksStore = useProfileLinksStore()

const loading = ref(true)

const headers: TableHeaders = [
  { name: 'Position', property: 'position' },
  { name: 'Name', property: 'name' },
  { name: 'Link', property: 'link' }
]
let items: any[] = []

async function fetchProfileLinks() {
  loading.value = true
  items = await profileLinKService.getAllForAdmin().then(r => r) || []
  loading.value = false
}

onMounted(async () => {
  await fetchProfileLinks()

  emitter.on('listUpdated', () => {
    fetchProfileLinks().then(r => r)
    profileLinksStore.fetchProfileLinks().then(r => r)
  })
})

onUnmounted(() => {
  emitter.off('listUpdated')
})
</script>

<template>
  <main>
    <Title title="Profile Links" :level="1" />

    <Loader :loading="loading" />

    <FormTable v-if="!loading" :headers="headers" :items="items" item-type="profile link"
               add-route-name="admin.links.add"
               edit-route-name="admin.links.edit"
               :delete-function="profileLinKService.deleteProfileLink"
               :move-function="profileLinKService.moveProfileLink"
               item-identifier="name" />
  </main>
</template>

<style scoped>

</style>
