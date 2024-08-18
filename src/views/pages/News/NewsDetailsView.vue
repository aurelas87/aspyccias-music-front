<script setup lang="ts">
import { useEmitter } from '@/plugins/emitter'
import { useNewsService } from '@/services/NewsService'
import { useNewsMapper } from '@/mappers/News/NewsMapper'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import Loader from '@/components/Loader.vue'
import Title from '@/components/Title.vue'
import NewsDetails from '@/models/News/NewsDetails'
import { useImage } from '@/composables/image'
import router from '@/router'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const emitter = useEmitter()
const newsService = useNewsService()
const newsMapper = useNewsMapper()
const { onImageError } = useImage()

const loading = ref(true)
const newsDetails = reactive<NewsDetails>(new NewsDetails())

async function fetchNews() {
  loading.value = true

  newsMapper.resetNewsDetails(newsDetails)

  const newsDetailsResponse = await newsService.get(props.slug).then(r => r)
  if (!newsDetailsResponse) {
    await router.push('/not-found')
  }

  newsMapper.mapResponseToNewsDetails(newsDetailsResponse, newsDetails)

  loading.value = false
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
  <transition appear>
    <div>
      <Loader :loading="loading" />

      <div v-if="!loading && newsDetails.date !== NewsDetails.EMPTY_DATE" class="w-[100%] lg:w-[80%] mx-auto">
        <Title :title="newsDetails.title || ''" :level="1" margins="mb-0" />
        <Title :title="$d(newsDetails.date, 'long')" :level="2" :icon="false" :uppercase="false" margins="mb-10" />

        <img :src="newsService.getNewsImageUri(newsDetails)" class="mb-10"
             alt="News preview" @error="onImageError" />

        <div class="text-justify">{{ newsDetails.content }}</div>
      </div>
    </div>
  </transition>
</template>

<style scoped>

</style>
