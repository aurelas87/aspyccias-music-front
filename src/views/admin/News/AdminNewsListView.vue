<script setup lang="ts">
import Loader from '@/components/Loader.vue'
import FormTable from '@/components/FormTable.vue'
import Title from '@/components/Title.vue'
import { onMounted, reactive, ref } from 'vue'
import { useNewsService } from '@/services/NewsService'
import { useAdminNewsMapper } from '@/mappers/News/AdminNewsMapper'
import { useEmitter } from '@/plugins/emitter'
import AdminPaginatedNewsList from '@/models/News/AdminPaginatedNewsList'
import type { TableHeaders } from '@/types/admin/Commons'

const newsService = useNewsService()
const adminNewsMapper = useAdminNewsMapper()
const emitter = useEmitter()

const loading = ref(false)

const headers: TableHeaders = [
  { name: 'Slug', property: 'slug' },
  { name: 'Title FR', property: 'titleFr' },
  { name: 'Title EN', property: 'titleEn'},
  { name: 'Date', property: 'date' }
]

const adminPaginatedNewsList = reactive<AdminPaginatedNewsList>(new AdminPaginatedNewsList())

async function fetchAdminNewsList(offset: number | null = null) {
  loading.value = true

  adminNewsMapper.resetAdminPaginatedNewsList(adminPaginatedNewsList)

  const adminPaginatedNewsListResponse = await newsService.getPaginatedForAdmin(offset).then(r => r)
  adminNewsMapper.mapAdminResponseToPaginatedNewsList(adminPaginatedNewsListResponse, adminPaginatedNewsList)

  loading.value = false
}

onMounted(async () => {
  await fetchAdminNewsList()

  emitter.on('listNext', () => {
    fetchAdminNewsList(adminPaginatedNewsList.nextOffset).then(r => r)
  })

  emitter.on('listPrevious', () => {
    fetchAdminNewsList(adminPaginatedNewsList.previousOffset).then(r => r)
  })
})
</script>

<template>
  <main>
    <Title title="News" :level="1" />

    <Loader :loading="loading" />

    <FormTable v-if="!loading" :headers="headers" :items="adminPaginatedNewsList.items" item-type="news"
               :previous-offset="adminPaginatedNewsList.previousOffset"
               :next-offset="adminPaginatedNewsList.nextOffset"
               add-route-name="admin.news.add"
               edit-route-name="admin.news.edit"
               edit-route-param-name="slug"
               :delete-function="() => {}" />
  </main>
</template>

<style scoped>

</style>
