<script setup lang="ts">
import { useNewsService } from '@/services/NewsService'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useEmitter } from '@/plugins/emitter'
import Loader from '@/components/Loader.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import NewsCard from '@/components/NewsCard.vue'
import CardList from '@/components/CardList.vue'
import Title from '@/components/Title.vue'
import PaginatedNewsList from '@/models/News/PaginatedNewsList'
import { useNewsMapper } from '@/mappers/NewsMapper'

const emitter = useEmitter()
const newsService = useNewsService()
const newsMapper = useNewsMapper()

const loading = ref(true)
const paginatedNewsList = reactive<PaginatedNewsList>(new PaginatedNewsList())

async function fetchNewsList(offset: number | null = null) {
  loading.value = true

  newsMapper.resetPaginatedNewsList(paginatedNewsList)

  const paginatedNewsListResponse = await newsService.getPaginated(offset).then(r => r)
  newsMapper.mapResponseToPaginatedNewsList(paginatedNewsListResponse, paginatedNewsList)

  loading.value = false
}

function fetchPreviousNews() {
  fetchNewsList(paginatedNewsList.previousOffset)
}

function fetchNextNews() {
  fetchNewsList(paginatedNewsList.nextOffset)
}

onMounted(async () => {
  await fetchNewsList()

  emitter.on('localeSwitched', () => {
    fetchNewsList().then(r => r)
  })
})

onBeforeUnmount(() => {
  emitter.off('localeSwitched')
})
</script>

<template>
  <transition appear>
    <div>
      <Title :title="$t('news.title')" :level="1" />

      <Loader :loading="loading" />

      <h3 v-if="!loading && paginatedNewsList.items.length === 0">{{ $t('news.none') }}</h3>

      <div v-else-if="!loading">
        <CardList>
            <NewsCard v-for="news in paginatedNewsList.items" :news="news" />
        </CardList>

        <div class="flex justify-center mt-5">
          <div class="basis-1/2">
            <a v-if="paginatedNewsList.previousOffset !== null"
               href="#"
               class="inline-block p-3 border border-transparent hover:text-primary hover:border-primary bg-dark-grey transition-300 rounded-custom"
               @click="fetchPreviousNews">
              <FontAwesomeIcon :icon="faChevronLeft" class="inline-block align-middle mr-3" />
              <span class="inline-block align-middle">{{ $t('news.list.newer') }}</span>
            </a>
          </div>

          <div class="basis-1/2">
            <a v-if="paginatedNewsList.nextOffset !== null"
               href="#"
               class="inline-block p-3 border border-transparent hover:text-primary hover:border-primary bg-dark-grey transition-300 rounded-custom"
               @click="fetchNextNews">
              <span class="inline-block align-middle">{{ $t('news.list.older') }}</span>
              <FontAwesomeIcon :icon="faChevronRight" class="inline-block align-middle ml-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>

</style>
