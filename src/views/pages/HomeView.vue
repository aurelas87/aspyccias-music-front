<script setup lang="ts">
import { useImage } from '@/composables/image'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useProfileService } from '@/services/ProfileService'
import { useNewsService } from '@/services/NewsService'
import { useNewsMapper } from '@/mappers/NewsMapper'
import { useProfileMapper } from '@/mappers/ProfileMapper'
import { useEmitter } from '@/plugins/emitter'
import CardList from '@/components/CardList.vue'
import NewsCard from '@/components/NewsCard.vue'
import Loader from '@/components/Loader.vue'
import Title from '@/components/Title.vue'
import News from '@/models/News/News'
import Profile from '@/models/Profile/Profile'

const { onImageError } = useImage()

const emitter = useEmitter()
const profileService = useProfileService()
const newsService = useNewsService()
const newsMapper = useNewsMapper()
const profileMapper = useProfileMapper()

const loadingNews = ref(true)
const loadingProfile = ref(true)

const profile = reactive<Profile>(new Profile())

const latestNews = reactive<News[]>([])

async function fetchProfile() {
  loadingProfile.value = true

  const profileResponse = await profileService.get().then(r => r)
  profileMapper.mapResponseToProfile(profileResponse, profile)

  loadingProfile.value = false
}

async function fetchLatestNews() {
  loadingNews.value = true

  latestNews.splice(0)

  const latestNewsResponse = await newsService.getLatest().then(r => r)
  newsMapper.mapResponseToNewsList(latestNewsResponse, latestNews)

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
    <div class="text-2xl mb-10">
      <p>{{ profile.welcome }}</p>
    </div>

    <Title :title="$t('news.latest')" :level="1" />
    <Loader :loading="loadingNews" />
    <h3 v-if="!loadingNews && latestNews.length === 0" class="mb-10">{{ $t('news.none') }}</h3>
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
          <Title :title="$t('home.about')" :level="2" />

          <Loader :loading="loadingProfile" />
          <div v-if="!loadingProfile">{{ profile.description }}</div>
        </div>
      </div>
    </transition>
  </main>
</template>
