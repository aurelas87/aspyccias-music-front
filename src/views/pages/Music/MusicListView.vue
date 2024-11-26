<script setup lang="ts">
import Title from '@/components/Title.vue'
import { computed, onMounted, reactive, ref, type UnwrapRef } from 'vue'
import Release from '@/models/Release/Release'
import { useReleaseService } from '@/services/ReleaseService'
import { useReleaseMapper } from '@/mappers/Release/ReleaseMapper'
import Loader from '@/components/Loader.vue'
import CardList from '@/components/CardList.vue'
import ReleaseCard from '@/components/ReleaseCard.vue'
import { ReleaseType } from '@/types/Release.ts'

const releaseService = useReleaseService()
const releaseMapper = useReleaseMapper()

const singleReleases = reactive<Release[]>([])
const epReleases = reactive<Release[]>([])
const albumReleases = reactive<Release[]>([])

const loadingSingles = ref(true)
const loadingEPs = ref(true)
const loadingAlbums = ref(true)

async function fetchReleases(releaseType: string, releases: Array<UnwrapRef<Release>>) {
  const releasesResponse = await releaseService.getByType(releaseType).then(r => r)
  releaseMapper.mapResponseToReleases(releasesResponse, releases)
}

async function fetchSingles() {
  loadingSingles.value = true
  await fetchReleases(ReleaseType.SINGLE, singleReleases)
  loadingSingles.value = false
}

async function fetchEPs() {
  loadingEPs.value = true
  await fetchReleases(ReleaseType.EP, epReleases)
  loadingEPs.value = false
}

async function fetchAlbums() {
  loadingAlbums.value = true
  await fetchReleases(ReleaseType.ALBUM, albumReleases)
  loadingAlbums.value = false
}

const loading = computed(() => {
  return loadingSingles.value && loadingEPs.value && loadingAlbums.value
})

const emptyReleases = computed(() => {
  return singleReleases.length === 0 && epReleases.length === 0 && albumReleases.length === 0
})

onMounted(async () => {
  await fetchSingles()
  await fetchEPs()
  await fetchAlbums()
})
</script>

<template>
  <main>
    <Loader :loading="loading" />
    <h3 v-if="!loading && emptyReleases">{{ $t('music.none') }}</h3>

    <div class="!last:mb-0">
      <div v-if="!loading && singleReleases.length > 0" class="mb-10">
        <Title title="Singles" :level="1" />
        <CardList class="release-card-list">
          <ReleaseCard v-for="singleRelease in singleReleases" :release="singleRelease" />
        </CardList>
      </div>

      <div v-if="!loading && epReleases.length > 0" class="mb-10">
        <Title title="EP" :level="1" />
        <CardList class="release-card-list">
          <ReleaseCard v-for="epRelease in epReleases" :release="epRelease" />
        </CardList>
      </div>

      <div v-if="!loading && albumReleases.length > 0" class="mb-10">
        <Title title="Albums" :level="1" />
        <CardList class="release-card-list">
          <ReleaseCard v-for="albumRelease in albumReleases" :release="albumRelease" />
        </CardList>
      </div>
    </div>
  </main>
</template>

<style lang="postcss" scoped>
.release-card-list {
  @apply sm:!grid-cols-2 lg:!grid-cols-4
}
</style>
