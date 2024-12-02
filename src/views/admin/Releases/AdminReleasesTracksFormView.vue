<script setup lang="ts">
import Title from '@/components/Title.vue'
import Loader from '@/components/Loader.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useReleaseService } from '@/services/ReleaseService.ts'
import { useRouter } from 'vue-router'
import type { AdminReleaseTrackData, AdminReleaseTrackFormData } from '@/types/Release.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FormField from '@/components/FormField.vue'
import { customDuration, customRequired, reduceErrors } from '@/composables/validation.ts'
import useVuelidate from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import { faAnglesRight, faDownLong, faPlus, faTrash, faUpLong } from '@fortawesome/free-solid-svg-icons'
import { DirectionEnum } from '@/types/admin/Commons.ts'
import { toast } from 'vue3-toastify'

const releaseService = useReleaseService()
const router = useRouter()

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const releaseTitle = ref('')
const loading = ref(true)
const tracksSubmitting = ref(false)

const state = reactive({
  tracks: <AdminReleaseTrackFormData[]>[]
})

const rules = {
  tracks: {
    $each: helpers.forEach({
      title: { customRequired },
      duration: { customRequired, customDuration }
    })
  }
}

const v$ = useVuelidate(rules, state)

const title = computed(() => {
  return 'Edit "' + releaseTitle.value + '" tracks'
})

const disabled = computed(() => {
  return tracksSubmitting.value ? true : undefined
})

const stateTracks = computed(() => {
  return state.tracks.sort((track1, track2) => {
    return (track1.position > track2.position) ? 1 : -1
  })
})

function isFirstIndex(index: number) {
  return index === 0
}

function isLastIndex(index: number) {
  return index === state.tracks.length - 1
}

function moveTrack(index: number, direction: DirectionEnum) {
  const newIndex = (direction === DirectionEnum.Down) ? index + 1 : index - 1
  const oldPosition = state.tracks[index].position

  state.tracks[index].position = state.tracks[newIndex].position
  state.tracks[newIndex].position = oldPosition
}

function addTrack() {
  state.tracks.push({
    position: state.tracks.length === 0 ? 1 : state.tracks[state.tracks.length - 1].position + 1,
    title: '',
    duration: ''
  })
}

function deleteTrack(index: number) {
  state.tracks.splice(index, 1)

  for (let nextIndex: number = index; nextIndex < state.tracks.length; nextIndex++) {
    state.tracks[nextIndex].position--
  }
}

async function submitTracks() {
  tracksSubmitting.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    tracksSubmitting.value = false

    return
  }

  releaseService.editTracks(props.slug, releaseTitle.value, {
    tracks: state.tracks.map((adminReleaseTrackFormData: AdminReleaseTrackFormData) => {
      const durationArray = adminReleaseTrackFormData.duration.split(':')

      return {
        title: adminReleaseTrackFormData.title,
        position: adminReleaseTrackFormData.position,
        duration: parseInt(durationArray[0], 10) * 60 + parseInt(durationArray[1], 10)
      }
    })
  }).then(() => {
    tracksSubmitting.value = false
  })
}

onMounted(async () => {
  const adminReleaseTracksResponse = await releaseService.getTracksForAdmin(props.slug).then((r) => r)
  if (!adminReleaseTracksResponse) {
    await router.push({ name: 'admin-not-found' })

    return
  }

  releaseTitle.value = adminReleaseTracksResponse.title
  adminReleaseTracksResponse.tracks.forEach((adminReleaseTrackData: AdminReleaseTrackData) => {
    let formattedDuration = Math.floor(adminReleaseTrackData.duration / 60).toString().padStart(2, '0')
    formattedDuration += ':' + adminReleaseTrackData.duration % 60

    state.tracks.push({
      position: adminReleaseTrackData.position,
      title: adminReleaseTrackData.title,
      duration: formattedDuration
    })
  })

  loading.value = false
})
</script>

<template>
  <transition appear>
    <div>
      <Loader :loading="loading" />

      <Title v-if="!loading" :title="title" :level="1" />

      <form v-if="!loading" novalidate class="w-full mx-auto"
            @submit.prevent.stop="submitTracks">
        <table class="w-full">
          <thead>
          <tr>
            <th>Position</th>
            <th>Title</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(track, index) in stateTracks">
            <td>{{ track.position.toString().padStart(2, '0') }}</td>

            <td>
              <FormField
                :has-error="v$.tracks.$each.$response.$errors[index].title.length"
                :error-message="reduceErrors(v$.tracks.$each.$response.$errors[index].title)"
                class="md:col-span-2"
              >
                <input
                  type="text"
                  placeholder="Track Title"
                  :name="'title-' + index"
                  maxlength="255"
                  v-model.trim="track.title"
                  :disabled="disabled"
                />
              </FormField>
            </td>

            <td>
              <FormField
                :has-error="v$.tracks.$each.$response.$errors[index].duration.length"
                :error-message="reduceErrors(v$.tracks.$each.$response.$errors[index].duration)"
                class="md:col-span-2"
              >
                <input
                  type="text"
                  placeholder="00:00"
                  :name="'duration-' + index"
                  v-model.trim="track.duration"
                  :disabled="disabled"
                />
              </FormField>
            </td>

            <td>
              <span class="hover:text-primary transition-300 inline-block w-5 h-4"
                    :class="{'cursor-pointer': !isFirstIndex(index)}"
                    @click="moveTrack(index, DirectionEnum.Up)">
                <FontAwesomeIcon v-if="!isFirstIndex(index)" :icon="faUpLong"></FontAwesomeIcon>
              </span>

                <span class="hover:text-primary transition-300 inline-block w-5 h-4"
                      :class="{'cursor-pointer': !isLastIndex(index)}"
                      @click="moveTrack(index, DirectionEnum.Down)">
                <FontAwesomeIcon v-if="!isLastIndex(index)" :icon="faDownLong"></FontAwesomeIcon>
              </span>

              <button type="button" class="button-custom button-delete ml-1" @click="deleteTrack(index)">
                <span>Delete</span>
                <FontAwesomeIcon :icon="faTrash" class="ml-3" />
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="p-0">
              <button type="button" class="w-full button-custom button-add !rounded-none"
                      @click="addTrack">
                <span>Add a track</span>
                <FontAwesomeIcon :icon="faPlus" class="ml-3" />
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <button type="submit" class="button-custom float-right mt-3" :disabled="disabled">
          <span>Submit</span>
          <FontAwesomeIcon v-if="!tracksSubmitting" :icon="faAnglesRight" class="ml-3" />
          <Loader v-else :loading="tracksSubmitting" class="ml-3 text-inherit" />
        </button>
      </form>
    </div>
  </transition>
</template>

<style scoped>

</style>
