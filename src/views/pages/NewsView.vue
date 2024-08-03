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

const emitter = useEmitter()
const newsService = useNewsService()

const loading = ref(true)
const paginatedNews = reactive<PaginatedNewsList>(newsService.emptyPaginatedNewsList)

async function fetchNews(offset: number | null = null) {
  loading.value = true

  paginatedNews.items.splice(0)
  paginatedNews.previous_offset = null
  paginatedNews.next_offset = null

  const fetchedNews = await newsService.getPaginated(offset).then(r => r)

  fetchedNews.items.forEach((newsItem) => {
    newsItem.date = (new Date(newsItem.date))
    paginatedNews.items.push(newsItem)
  })

  paginatedNews.previous_offset = fetchedNews.previous_offset
  paginatedNews.next_offset = fetchedNews.next_offset

  loading.value = false
}

function fetchPreviousNews() {
  fetchNews(paginatedNews.previous_offset)
}

function fetchNextNews() {
  fetchNews(paginatedNews.next_offset)
}

onMounted(async () => {
  await fetchNews()

  emitter.on('localeSwitched', () => {
    fetchNews().then(r => r)
  })
})

onBeforeUnmount(() => {
  emitter.off('localeSwitched')
})
</script>

<template>
  <main>
    <h1>{{ $t('news.title') }}</h1>

    <Loader :loading="loading" />

    <h3 v-if="!loading && paginatedNews.items.length === 0" class="text-center">{{ $t('news.none') }}</h3>

    <div v-else-if="!loading">
      <CardList>
        <NewsCard v-for="news in paginatedNews.items" :news="news" />
      </CardList>

      <div class="flex justify-center mt-3">
        <div class="basis-1/2 text-center">
          <a v-if="paginatedNews.previous_offset !== null"
             href="#"
             class="inline-block p-3 border border-transparent hover:text-primary hover:border-primary transition-300 rounded-custom"
             @click="fetchPreviousNews">
            <FontAwesomeIcon :icon="faChevronLeft" class="inline-block align-middle mr-3" />
            <span class="inline-block align-middle">{{ $t('news.list.newer') }}</span>
          </a>
        </div>

        <div class="basis-1/2 text-center">
          <a v-if="paginatedNews.next_offset !== null"
             href="#"
             class="inline-block p-3 border border-transparent hover:text-primary hover:border-primary transition-300 rounded-custom"
             @click="fetchNextNews">
            <span class="inline-block align-middle">{{ $t('news.list.older') }}</span>
            <FontAwesomeIcon :icon="faChevronRight" class="inline-block align-middle ml-3" />
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
