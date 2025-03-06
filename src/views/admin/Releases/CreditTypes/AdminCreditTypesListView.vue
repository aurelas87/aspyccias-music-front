<script setup lang="ts">
import Title from '@/components/Title.vue'
import FormTable from '@/components/FormTable.vue'
import Loader from '@/components/Loader.vue'
import { useReleaseCreditTypeService } from '@/services/ReleaseCreditTypeService.ts'
import { onMounted, onUnmounted, ref } from 'vue'
import { useEmitter } from '@/plugins/emitter'
import type { TableHeaders } from '@/types/admin/Commons'

const releaseCreditTypeService = useReleaseCreditTypeService()
const emitter = useEmitter()

const loading = ref(true)

const headers: TableHeaders = [
  { name: 'Key', property: 'credit_name_key' },
  { name: 'Name FR', property: 'credit_name_fr' },
  { name: 'Name EN', property: 'credit_name_en' }
]
let items: any[] = []

async function fetchReleaseCreditTypes() {
  loading.value = true
  items = await releaseCreditTypeService.getAllForAdmin().then(r => r) || []
  loading.value = false
}

onMounted(async () => {
  await fetchReleaseCreditTypes()

  emitter.on('listUpdated', () => {
    fetchReleaseCreditTypes().then(r => r)
  })
})

onUnmounted(() => {
  emitter.off('listUpdated')
})
</script>

<template>
  <main>
    <Title title="Credit Types" :level="1" />

    <Loader :loading="loading" />

    <FormTable v-if="!loading" :headers="headers" :items="items" item-type="credit type"
               add-route-name="admin.credit-types.add"
               edit-route-name="admin.credit-types.edit"
               :delete-function="releaseCreditTypeService.deleteReleaseCreditType"
               item-identifier="credit_name_key" />
  </main>
</template>

<style scoped>

</style>
