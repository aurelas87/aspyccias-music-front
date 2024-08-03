<script setup lang="ts">
import { useImage } from '@/composables/image'
import { useNewsService } from '@/services/NewsService'

const { onImageError } = useImage()
const newsService = useNewsService()

defineProps<{
  news: NewsListItem
}>()
</script>

<template>
  <transition appear>
    <div class="basis-full md:basis-1/3 text-center rounded-custom shadow-white-double">
      <img
        :src="newsService.getNewsThumbnailUri($props.news)"
        alt="News preview"
        width="100%"
        class="rounded-t-custom"
        @error="onImageError" />

      <div class="px-3 pb-3 bg-neutral-700/80 rounded-b-custom">
        <h3 class="p-3">{{ $props.news.title }}</h3>

        <p class="text-sm text-neutral-300 font-bold">{{ $d($props.news.date) }}</p>
        <a :href="newsService.getNewsItemUri($props.news.slug)"
           class="inline-block w-fit rounded-custom p-3 bg-dark-grey border border-dark-grey hover:border-primary hover:text-primary transition-300">
          {{ $t('news.more_about_it') }}
        </a>
      </div>
    </div>
  </transition>
</template>

<style scoped>

</style>
