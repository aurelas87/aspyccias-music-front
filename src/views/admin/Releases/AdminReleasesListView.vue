<script setup lang="ts">
import Loader from '@/components/Loader.vue'
import FormTable from '@/components/FormTable.vue'
import Title from '@/components/Title.vue'
import { onMounted, reactive, ref } from 'vue'
import { useReleaseService } from '@/services/ReleaseService'
import { useAdminReleaseMapper } from '@/mappers/Release/AdminReleaseMapper'
import { useEmitter } from '@/plugins/emitter'
import type { TableHeaders } from '@/types/admin/Commons'
import AdminPaginatedReleaseList from '@/models/Release/AdminPaginatedReleaseList'

const releaseService = useReleaseService()
const adminReleaseMapper = useAdminReleaseMapper()
const emitter = useEmitter()

const loading = ref(false)

const headers: TableHeaders = [
  { name: 'Slug', property: 'slug' },
  { name: 'Type', property: 'type' },
  { name: 'Title', property: 'title' },
  { name: 'Release Date', property: 'releaseDate' }
]

const adminPaginatedReleaseList = reactive<AdminPaginatedReleaseList>(new AdminPaginatedReleaseList())

async function fetchAdminReleaseList(offset: number | null = null) {
  loading.value = true

  adminReleaseMapper.resetAdminPaginatedReleaseList(adminPaginatedReleaseList)

  const adminPaginatedReleaseListResponse = await releaseService.getAllForAdmin(offset).then(r => r)
  adminReleaseMapper.mapAdminResponseToPaginatedNewsList(adminPaginatedReleaseListResponse, adminPaginatedReleaseList)

  loading.value = false
}

onMounted(async () => {
  await fetchAdminReleaseList()

  emitter.on('listNext', () => {
    fetchAdminReleaseList(adminPaginatedReleaseList.nextOffset).then(r => r)
  })

  emitter.on('listPrevious', () => {
    fetchAdminReleaseList(adminPaginatedReleaseList.previousOffset).then(r => r)
  })

  emitter.on('listUpdated', () => {
    fetchAdminReleaseList().then(r => r)
  })
})
</script>

<template>
  <main>
    <Title title="Releases" :level="1" />

    <Loader :loading="loading" />

    <FormTable v-if="!loading" :headers="headers" :items="adminPaginatedReleaseList.items" item-type="release"
               :previous-offset="adminPaginatedReleaseList.previousOffset"
               :next-offset="adminPaginatedReleaseList.nextOffset"
               add-route-name="admin.releases.add"
               edit-route-name="admin.releases.edit"
               view-route-name="music.details"
               :custom-links="[
                 { name: 'admin.releases.edit.tracks', label: 'Tracks', icon: 'list-ol' },
                 { name: 'admin.releases.edit.links', label: 'Links', icon: 'link' },
                 { name: 'admin.releases.edit.credits', label: 'Credits', icon: 'circle-info' }
               ]"
               :delete-function="releaseService.deleteRelease"
               item-identifier="slug" />
  </main>
</template>

<style scoped>

</style>
