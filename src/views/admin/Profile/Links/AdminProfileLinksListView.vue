<script setup lang="ts">
import Title from '@/components/Title.vue'
import FormTable from '@/components/FormTable.vue'
import Loader from '@/components/Loader.vue'
import { useProfileLinkService } from '@/services/ProfileLinkService'
import { onMounted, ref } from 'vue'
import { useEmitter } from '@/plugins/emitter'

const profileLinKService = useProfileLinkService()
const emitter = useEmitter()

const loading = ref(true)

const headers = ['position', 'name', 'link']
let items: any[] = []

async function fetchProfileLinks() {
  loading.value = true
  items = await profileLinKService.getAllForAdmin().then(r => r) || []
  loading.value = false
}

onMounted(async () => {
  await fetchProfileLinks()

  emitter.on('itemDeleted', () => {
    fetchProfileLinks().then(r => r)
  })
})
</script>

<template>
  <main>
    <Title title="Profile Links" :level="1" />

    <Loader :loading="loading" />

    <FormTable v-if="!loading" :headers="headers" :items="items" :movable="true"
               add-route-name="admin.links.add"
               edit-route-name="admin.links.edit"
               :delete-function="profileLinKService.deleteProfileLink" />
  </main>
</template>

<style scoped>

</style>
