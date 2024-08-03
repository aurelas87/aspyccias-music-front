<script setup lang="ts">
import { useImage } from '@/composables/image'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useProfileService } from '@/services/ProfileService'
import { useNewsService } from '@/services/NewsService'
import { useEmitter } from '@/plugins/emitter'
import CardList from '@/components/CardList.vue'
import NewsCard from '@/components/NewsCard.vue'
import Loader from '@/components/Loader.vue'

const { onImageError } = useImage()

const emitter = useEmitter()
const profileService = useProfileService()
const newsService = useNewsService()

const loadingNews = ref(true)
const loadingProfile = ref(true)

const profile = reactive<Profile>({
  welcome: '',
  description: ''
})

const latestNews = reactive<NewsList>([])

async function fetchProfile() {
  loadingProfile.value = true

  const fetchedProfile = await profileService.get().then(r => r)
  profile.welcome = fetchedProfile?.welcome || ''
  profile.description = fetchedProfile?.description || ''

  loadingProfile.value = false
}

async function fetchLatestNews() {
  loadingNews.value = true

  latestNews.splice(0)

  const fetchedLatestNews = await newsService.getLatest().then(r => r)

  fetchedLatestNews.forEach((latestNewsItem) => {
    latestNewsItem.date = (new Date(latestNewsItem.date))
    latestNews.push(latestNewsItem)
  })

  loadingNews.value = false
}

onMounted(async () => {
  await fetchProfile()
  await fetchLatestNews()

  emitter.on('localeSwitched', () => {
    fetchProfile().then(r => r)
    fetchLatestNews().then(r => r)
  })
})

onBeforeUnmount(() => {
  emitter.off('localeSwitched')
})
</script>

<template>
  <main>
    <div class="text-center text-2xl mb-10">
      <p>{{ profile.welcome }}</p>
    </div>

    <h1>{{ $t('news.latest') }}</h1>
    <Loader :loading="loadingNews" />
    <h3 v-if="!loadingNews && latestNews.length === 0" class="text-center mb-10">{{ $t('news.none') }}</h3>
    <CardList v-else-if="!loadingNews">
      <NewsCard v-for="latestNewsItem in latestNews" :news="latestNewsItem" />
    </CardList>

    <transition appear>
      <div class="bg-primary/50 py-3 px-5 sm:py-10 sm:px-20 mt-10 rounded-custom shadow-white-double">
        <div class="mx-auto sm:float-left w-fit h-fit mr-5 mb-5 sm:mr-20 sm:mb-10 border-2 rounded-custom">
          <img :src="profileService.getProfilePictureUri()"
               alt="Aspyccias profile picture"
               width="400" height="484"
               class="relative top-3 left-3 rounded-custom"
               @error="onImageError" />
        </div>

        <div class="text-justify">
          <h2>{{ $t('home.about') }}</h2>

          <Loader :loading="loadingProfile" />
          <div v-if="!loadingProfile">{{ profile.description }}</div>
        </div>
      </div>
    </transition>
  </main>
</template>
