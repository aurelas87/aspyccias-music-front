<script setup lang="ts">
import Loader from '@/components/Loader.vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref, type UnwrapRef } from 'vue'
import { useEmitter } from '@/plugins/emitter'
import { useReleaseService } from '@/services/ReleaseService'
import { useReleaseMapper } from '@/mappers/Release/ReleaseMapper'
import { useImage } from '@/composables/image'
import ReleaseDetails from '@/models/Release/ReleaseDetails'
import ReleaseLink from '@/models/Release/ReleaseLink'
import Title from '@/components/Title.vue'
import ReleaseLinkTemplate from '@/components/ReleaseLink.vue'
import { useI18n } from 'vue-i18n'
import { ReleaseLinkCategory } from '@/types/ReleaseLinkCategory'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const i18n = useI18n()
const emitter = useEmitter()
const releaseService = useReleaseService()
const releaseMapper = useReleaseMapper()
const { onImageError } = useImage()

const loading = ref(true)
const releaseDetails = reactive<ReleaseDetails>(new ReleaseDetails())

async function fetchRelease() {
  loading.value = true

  releaseMapper.resetReleaseDetails(releaseDetails)

  const releadDetailsResponse = await releaseService.get(props.slug).then(r => r)
  releaseMapper.mapResponseToReleaseDetails(releadDetailsResponse, releaseDetails)

  loading.value = false
}

onMounted(async () => {
  await fetchRelease()

  emitter.on('localeSwitched', () => {
    fetchRelease().then(r => r)
  })
})

onBeforeUnmount(() => {
  emitter.off('localeSwitched')
})

const releaseDate = computed(() => {
  return (releaseDetails.releaseDate !== null)
    ? i18n.t('music.released') + ' ' + i18n.d(releaseDetails.releaseDate, 'long')
    : i18n.t('music.no_release_date')
})

function filterReleaseLinks(linkCategory: ReleaseLinkCategory): Array<UnwrapRef<ReleaseLink>> {
  return releaseDetails.links.filter((releaseLink: UnwrapRef<ReleaseLink>) => {
    return releaseLink.category === linkCategory
  })
}

const releaseListenLinks = computed(() => filterReleaseLinks(ReleaseLinkCategory.LISTEN))
const releaseBuyLinks = computed(() => filterReleaseLinks(ReleaseLinkCategory.BUY))
const releaseSmartLinks = computed(() => filterReleaseLinks(ReleaseLinkCategory.SMART_LINK))
</script>

<template>
  <transition appear>
    <div>
      <Loader :loading="loading" />

      <div v-if="!loading && releaseDetails.releaseDate !== ReleaseDetails.EMPTY_RELEASE_DATE"
           class="w-[100%] 2xl:w-[80%] mx-auto"
      >
        <Title :title="releaseDetails.title || ''" :level="1" />

        <div class="mx-auto w-fit h-fit lg:float-left lg:mr-10 lg:mb-10">
          <img :src="releaseService.getReleaseImageUri(releaseDetails.artworkFrontImage, false)"
               alt="Front Artwork"
               width="450" height="450"
               class="release-cover"
               @error="onImageError" />
        </div>

        <div class="lg:text-left lg:mb-10">
          <Title :title="releaseDate" :level="2" :icon="false" :uppercase="false" />

          <p v-if="releaseListenLinks.length > 0">
            {{ $t('music.listen_on') }}
            <ReleaseLinkTemplate v-for="releaseLink in releaseListenLinks" :release-link="releaseLink" />
          </p>
          <p v-if="releaseBuyLinks.length > 0">
            {{ $t('music.buy_on') }}
            <ReleaseLinkTemplate v-for="releaseLink in releaseBuyLinks" :release-link="releaseLink" />
          </p>

          <div class="text-justify">
<!--            {{ releaseDetails.description }}-->
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                          ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                          anim id est laborum.</p>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                          dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
                          sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
                          magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
                          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
                          ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
                          nulla pariatur?</p>
          </div>
        </div>

        <div class="clear-both flex flex-col gap-10">
          <div v-if="releaseSmartLinks.length > 0" v-for="releaseSmartLink in releaseSmartLinks">
            <div v-html="releaseSmartLink.embedded" class="shadow-white-double"></div>
          </div>

          <div>
            <Title :title="$t('music.tracks')" :level="2" />
          </div>

          <div>
            <Title :title="$t('music.credits')" :level="2" />
          </div>

          <div>
            <Title v-if="releaseDetails.artworkBackImage" :title="$t('music.back_cover')" :level="2" />
            <img v-if="releaseDetails.artworkBackImage"
                 :src="releaseService.getReleaseImageUri(releaseDetails.artworkBackImage, false)"
                 alt="Front Artwork"
                 width="450" height="450"
                 class="release-cover mx-auto"
                 @error="onImageError" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="postcss" scoped>
@import '@/assets/css/base.css';
@import '@/assets/css/shadows.css';

.release-cover {
  @apply aspect-square rounded-custom shadow-white-double w-full lg:w-[350px] 2xl:w-[450px];
}
</style>
