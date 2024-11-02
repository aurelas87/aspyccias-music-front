<script setup lang="ts">
import Title from '@/components/Title.vue'
import FormTable from '@/components/FormTable.vue'
import { useProfileLinkService } from '@/services/ProfileLinkService'
import { onMounted, ref } from 'vue'
import Loader from '@/components/Loader.vue'

const profileLinKService = useProfileLinkService()

const loading = ref(true)

const headers = ['position', 'name', 'link']
let items: any[] = []

onMounted(async () => {
  loading.value = true

  items = await profileLinKService.getAllForAdmin().then(r => r) || []

  loading.value = false
})
</script>

<template>
  <main>
    <Title title="Profile Links" :level="1" />

    <Loader :loading="loading" />

    <FormTable v-if="!loading && items.length > 0" :headers="headers" :items="items" :movable="true"
               add-route-name="admin.links.add"
               edit-route-name="admin.links.edit" />
    <p v-if="!loading && items.length === 0">No links</p>
  </main>
</template>

<style scoped>

</style>
