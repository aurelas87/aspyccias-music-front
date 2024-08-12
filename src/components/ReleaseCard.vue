<script setup lang="ts">
import { ref, type UnwrapNestedRefs } from 'vue'
import Release from '@/models/Release/Release'
import { useImage } from '@/composables/image'
import { useReleaseService } from '@/services/ReleaseService'
import Title from '@/components/Title.vue'

const { onImageError } = useImage()
const releaseService = useReleaseService()

defineProps<{
  release: UnwrapNestedRefs<Release>
}>()

const showTitle = ref(false)
</script>

<template>
  <transition appear>
    <div v-if="$props.release.releaseDate !== Release.EMPTY_RELEASE_DATE"
         class="basis-full sm:basis-1/3 lg:basis-1/4 rounded-custom shadow-white-double aspect-square relative"
         @mouseover="showTitle = true"
         @mouseleave="showTitle = false"
    >
      <RouterLink :to="releaseService.getReleaseUri($props.release.slug || '')">
        <img
          :src="releaseService.getReleaseImageUri($props.release.artworkFrontImage, true)"
          alt="News preview"
          width="100%"
          class="rounded-custom aspect-square"
          @error="onImageError" />

        <div
          class="absolute px-3 pb-3 transition-300 w-full h-full z-10 top-0 bg-dark-grey/60 rounded-custom flex flex-col justify-center"
          :class="{ 'opacity-0': !showTitle }"
        >
          <div class="w-fit mx-auto p-3 rounded-custom bg-dark-grey/80">
            <Title :title="$props.release.title || ''" :level="2" :icon="false" :uppercase="false"
                   class="bg-clip-text text-transparent bg-gradient-to-t from-primary to-yellow" />
            <Title :title="$d($props.release.releaseDate)" :level="3" :icon="false" :uppercase="false" />
          </div>
        </div>
      </RouterLink>
    </div>
  </transition>
</template>

<style scoped>

</style>
