<script setup lang="ts">
import Title from '@/components/Title.vue'
import FormTable from '@/components/FormTable.vue'
import Loader from '@/components/Loader.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useEmitter } from '@/plugins/emitter'
import type { TableHeaders } from '@/types/admin/Commons'
import { useReleaseLinkNameService } from '@/services/ReleaseLinkNameService.ts'

const releaseLinkNameService = useReleaseLinkNameService()
const emitter = useEmitter()

const loading = ref(true)

const headers: TableHeaders = [
  { name: 'Link Name', property: 'link_name' },
]
let items: any[] = []

async function fetchReleaseLinkNames() {
  loading.value = true
  items = await releaseLinkNameService.getAllForAdmin().then(r => r) || []
  loading.value = false
}

onMounted(async () => {
  await fetchReleaseLinkNames()

  emitter.on('listUpdated', () => {
    fetchReleaseLinkNames().then(r => r)
  })
})

onUnmounted(() => {
  emitter.off('listUpdated')
})
</script>

<template>
  <main>
    <Title title="Release Link Names" :level="1" />

    <Loader :loading="loading" />

    <FormTable v-if="!loading" :headers="headers" :items="items" item-type="link name"
               add-route-name="admin.release-link-names.add"
               edit-route-name="admin.release-link-names.edit"
               :delete-function="releaseLinkNameService.deleteReleaseLinkName"
               item-identifier="link_name" />
  </main>
</template>

<style scoped>

</style>
