<script setup lang="ts">
import Title from '@/components/Title.vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import Loader from '@/components/Loader.vue'
import {
  customDate,
  customReleaseType,
  customReleaseTypeValidator,
  customRequired,
  customSlug,
  reduceErrors
} from '@/composables/validation'
import useVuelidate from '@vuelidate/core'
import { toast } from 'vue3-toastify'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import FormField from '@/components/FormField.vue'
import FormImage from '@/components/FormImage.vue'
import { useReleaseService } from '@/services/ReleaseService.ts'
import { useEmitter } from '@/plugins/emitter'
import { useRouter } from 'vue-router'
import type { ImagesState } from '@/types/admin/Commons'
import type { FormStep, FormSteps } from '@/types/admin/FormStep.ts'
import { useAdminReleaseMapper } from '@/mappers/Release/AdminReleaseMapper.ts'
import { type ReleaseData, ReleaseImageType, ReleaseType } from '@/types/Release.ts'
import AdminReleaseDetails from '@/models/Release/AdminReleaseDetails.ts'

const releaseService = useReleaseService()
const emitter = useEmitter()
const router = useRouter()
const adminReleaseMapper = useAdminReleaseMapper()

library.add(fas)
library.add(far)

const props = defineProps({
  slug: {
    type: String,
    required: false
  }
})

const formSteps = reactive<FormSteps>([
  { name: 'info', icon: 'record-vinyl', error: false },
  { name: 'content', icon: 'align-justify', error: false },
  { name: 'artworks', icon: 'images', error: false }
])

const stateInfo = reactive({
  title: '',
  type: '',
  releaseDate: '',
  slug: ''
})

const stateDetails = reactive({
  fr: {
    description: ''
  },
  en: {
    description: ''
  },
  artworkBackImage: false
})

const stateArtworks = reactive<ImagesState>({
  artworkFrontImageFile: null,
  artworkBackImageFile: null
})

const rulesDate = {
  title: { customRequired },
  type: { customRequired, customReleaseType },
  releaseDate: { customRequired, customDate },
  slug: { customRequired, customSlug }
}

const rulesDetails = {
  fr: {
    description: { customRequired }
  },
  en: {
    description: { customRequired }
  }
}

const v$info = useVuelidate(rulesDate, stateInfo)
const v$details = useVuelidate(rulesDetails, stateDetails)

const loading = ref(false)
const currentStepNumber = ref(0)
const releaseSubmitting = ref(false)

const adminReleaseDetails = reactive<AdminReleaseDetails>(new AdminReleaseDetails())

const artworkFrontImageFile = ref('')

const title = computed(() => {
  const action = props.slug ? 'Edit' : 'Add'
  return action + ' Release'
})

const disabled = computed(() => {
  return releaseSubmitting.value ? true : undefined
})

const releaseTypeChoices = Object.keys(ReleaseType).map((name) => {
  const tempValue = ReleaseType[name as keyof typeof ReleaseType]

  return {
    value: tempValue,
    text: tempValue.slice(0, 1).toUpperCase() + tempValue.slice(1),
  };
});

async function validateStep(step: number) {
  if (step === 2) {
    formSteps[2].error = false

    artworkFrontImageFile.value = ''

    if (!props.slug && !(stateArtworks.artworkFrontImageFile instanceof File)) {
      formSteps[2].error = true
      artworkFrontImageFile.value = 'validation.required'
    }

    return
  }

  let validator = null
  switch (step) {
    case 0:
      validator = v$info
      break
    case 1:
      validator = v$details
      break
  }

  if (!validator) {
    return
  }

  validator.value.$reset()
  await validator.value.$validate()

  formSteps[step].error = validator.value.$error
}

const artworkFrontImageChangedEvent = 'artworkFrontImageChanged';
const artworkBackImageChangedEvent = 'artworkBackImageChanged';

const artworkFrontImageSubmitEvent = 'submitArtworkFrontImage';
const artworkBackImageSubmitEvent = 'submitArtworkBackImage';

const artworkFrontImageUploadedEvent = 'artworkFrontImageUploaded';
const artworkBackImageUploadedEvent = 'artworkBackImageUploaded';

async function submitRelease() {
  releaseSubmitting.value = true

  for (let stepNumber: number = 0; stepNumber < formSteps.length; stepNumber++) {
    await validateStep(stepNumber)
  }

  const isFormValid = formSteps.every((thisStep: FormStep) => !thisStep.error)

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    releaseSubmitting.value = false

    return
  }

  const data: ReleaseData = {
    title: stateInfo.title,
    type: stateInfo.type,
    release_date: stateInfo.releaseDate,
    slug: stateInfo.slug,
    fr: stateDetails.fr,
    en: stateDetails.en,
    artwork_back_image: stateArtworks.artworkBackImageFile instanceof File || stateDetails.artworkBackImage
  };

  (
    (props.slug)
      ? releaseService.editRelease(props.slug, data)
      : releaseService.addRelease(data)
  ).then(async (newsResponse: boolean | null) => {
    if (newsResponse === true) {
      if (props.slug) {
        const releaseDetailsResponse = await releaseService.get(data.slug).then(r => r)
        if (!releaseDetailsResponse) {
          await router.push({ name: 'admin-not-found' })
        }
      }

      if (stateArtworks.artworkFrontImageFile instanceof File
        || stateArtworks.artworkBackImageFile instanceof File
      ) {
        if (stateArtworks.artworkFrontImageFile instanceof File) {
          emitter.emit(artworkFrontImageSubmitEvent)
        } else if (stateArtworks.artworkBackImageFile instanceof File) {
          emitter.emit(artworkBackImageSubmitEvent)
        }
      } else {
        await router.push({ name: 'admin.releases' })
      }
    }

    releaseSubmitting.value = false
  })
}

function stepCheckIcon(stepNumber: number): string {
  return formSteps[stepNumber].error ? 'circle-exclamation' : 'circle-check'
}

onMounted(async () => {
  if (props.slug) {
    loading.value = true

    const adminReleaseDetailsResponse = await releaseService.getForAdmin(props.slug).then((r) => r)
    if (!adminReleaseDetailsResponse) {
      await router.push({ name: 'admin-not-found' })

      return
    }

    adminReleaseMapper.mapAdminResponseToReleaseDetails(adminReleaseDetailsResponse, adminReleaseDetails)

    const releaseDate = new Date(adminReleaseDetailsResponse.release_date)
    stateInfo.releaseDate =
      releaseDate.getFullYear() +
      '-' + (releaseDate.getMonth() + 1).toString().padStart(2, '0') +
      '-' + releaseDate.getDate().toString().padStart(2, '0')

    stateInfo.title = adminReleaseDetailsResponse.title
    stateInfo.type = adminReleaseDetailsResponse.type
    stateInfo.slug = adminReleaseDetailsResponse.slug

    stateDetails.fr.description = adminReleaseDetailsResponse.description_fr
    stateDetails.en.description = adminReleaseDetailsResponse.description_en
    stateDetails.artworkBackImage = adminReleaseDetailsResponse.artwork_back_image

    loading.value = false
  }

  watch(currentStepNumber, async () => {
    if (currentStepNumber.value === 0) {
      return
    }

    let prevStep = currentStepNumber.value - 1
    while (prevStep >= 0) {
      await validateStep(prevStep)
      prevStep--
    }
  })

  emitter.on(artworkFrontImageChangedEvent, (artworkFrontImageFile: File) => {
    stateArtworks.artworkFrontImageFile = artworkFrontImageFile
    validateStep(2)
  })

  emitter.on(artworkBackImageChangedEvent, (artworkBackImageFile: File | null = null) => {
    stateArtworks.artworkBackImageFile = artworkBackImageFile

    if (!(stateArtworks.artworkBackImageFile instanceof File)) {
      stateDetails.artworkBackImage = false
    }
  })

  emitter.on(artworkFrontImageUploadedEvent, async () => {
    if (stateArtworks.artworkBackImageFile instanceof File) {
      emitter.emit(artworkBackImageSubmitEvent)
    } else {
      await router.push({ name: 'admin.releases' })
    }
  })

  emitter.on(artworkBackImageUploadedEvent, async () => {
    await router.push({ name: 'admin.releases' })
  })
})

onUnmounted(() => {
  emitter.off(artworkFrontImageChangedEvent)
  emitter.off(artworkBackImageChangedEvent)

  emitter.off(artworkFrontImageUploadedEvent)
  emitter.off(artworkBackImageUploadedEvent)
})
</script>

<template>
  <transition appear>
    <div>
      <Title :title="title" :level="1" />

      <Loader :loading="loading" />

      <transition-group appear>
        <ol v-if="!loading" class="form-stepper">
          <li v-for="(formStep, stepNumber) in formSteps">
            <hr
              v-if="stepNumber > 0"
              :class="{
                'before-current-step': currentStepNumber >= stepNumber,
                'after-current-step': currentStepNumber < stepNumber
              }"
            />

            <p>
              <FontAwesomeIcon
                :icon="['fas', formStep.icon]"
                class="step-icon"
                :class="{
                  'current-step': currentStepNumber === stepNumber,
                  'beyond-step': currentStepNumber > stepNumber
                }"
                @click="currentStepNumber = stepNumber"
              />
              <FontAwesomeIcon
                :icon="['fas', stepCheckIcon(stepNumber)]"
                class="step-status"
                :class="{
                  'unchecked-step': currentStepNumber <= stepNumber,
                  'success-step': !formSteps[stepNumber].error,
                  'error-step': formSteps[stepNumber].error
                }"
              />
            </p>

            <hr
              v-if="stepNumber < formSteps.length - 1"
              :class="{
                'before-current-step': currentStepNumber > stepNumber,
                'after-current-step': currentStepNumber <= stepNumber
              }"
            />
          </li>
        </ol>

        <div v-if="!loading" class="flex justify-center flex-wrap"
             :class="{ 'mt-10': currentStepNumber === 2 }" >
          <div>
            <Title v-if="currentStepNumber === 2" title="Front Artwork" :level="2" :icon="false" />
            <FormImage
              image-alt="Release front artwork"
              :image-url="releaseService.getReleaseImageUri(adminReleaseDetails, ReleaseImageType.FRONT)"
              image-width="450px"
              image-height="450px"
              resource-type="releases"
              :resource-slug="stateInfo.slug"
              :prefix="ReleaseImageType.FRONT"
              :stateEvent="artworkFrontImageChangedEvent"
              :submit-event="artworkFrontImageSubmitEvent"
              :uploaded-event="artworkFrontImageUploadedEvent"
              :image-error="artworkFrontImageFile"
              :class="{ 'absolute opacity-0 -z-50': currentStepNumber !== 2 }"
            />
          </div>

          <div>
            <Title v-if="currentStepNumber === 2" title="Back Artwork" :level="2" :icon="false" />
            <FormImage
              image-alt="Release back artwork"
              :image-url="releaseService.getReleaseImageUri(adminReleaseDetails, ReleaseImageType.BACK)"
              image-width="450px"
              image-height="450px"
              resource-type="releases"
              :resource-slug="stateInfo.slug"
              :prefix="ReleaseImageType.BACK"
              :stateEvent="artworkBackImageChangedEvent"
              :uploaded-event="artworkBackImageUploadedEvent"
              :submit-event="artworkBackImageSubmitEvent"
              :deletable="true"
              :class="{ 'absolute opacity-0 -z-50': currentStepNumber !== 2 }"
            />
          </div>
        </div>

        <form v-if="!loading" novalidate class="sm:w-[80%] xl:w-[60%] mx-auto"
          :class="{ 'mt-10': currentStepNumber !== 2 }"
          @submit.prevent.stop="submitRelease"
        >
          <fieldset v-if="currentStepNumber === 0">
            <legend>Release Infos</legend>

            <FormField
              :has-error="v$info.title.$error"
              :error-message="reduceErrors(v$info.title.$errors)"
              class="md:col-span-2"
            >
              <input
                type="text"
                placeholder="Release Title"
                name="title"
                maxlength="255"
                v-model.trim="stateInfo.title"
                :disabled="disabled"
              />
            </FormField>

            <FormField
              :has-error="v$info.type.$error"
              :error-message="reduceErrors(v$info.type.$errors)"
              class="md:col-span-2"
            >
              <select
                name="type"
                v-model="stateInfo.type"
                :disabled="disabled"
                :class="{ 'text-gray-400': !(customReleaseTypeValidator(stateInfo.type)) }"
              >
                <option :selected="true" value="" :disabled="true" Hidden>Type</option>
                <option v-for="releaseTypeChoice in releaseTypeChoices" :value="releaseTypeChoice.value">
                  {{ releaseTypeChoice.text }}
                </option>
              </select>
            </FormField>

            <FormField
              :has-error="v$info.releaseDate.$error"
              :error-message="reduceErrors(v$info.releaseDate.$errors)"
              class="md:col-span-2"
            >
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                name="release-date"
                maxlength="10"
                v-model.trim="stateInfo.releaseDate"
                :disabled="disabled"
              />
            </FormField>

            <FormField
              :has-error="v$info.slug.$error"
              :error-message="reduceErrors(v$info.slug.$errors)"
              class="md:col-span-2"
            >
              <input
                type="text"
                placeholder="release-custom-slug"
                name="slug"
                maxlength="255"
                v-model.trim="stateInfo.slug"
                :disabled="disabled"
              />
            </FormField>
          </fieldset>

          <fieldset v-if="currentStepNumber === 1">
            <legend>French</legend>

            <FormField
              :has-error="v$details.fr.description.$error"
              :error-message="reduceErrors(v$details.fr.description.$errors)"
              class="md:col-span-2"
            >
              <textarea
                placeholder="Description de la release"
                name="description-fr"
                rows="10"
                maxlength="10000"
                v-model.trim="stateDetails.fr.description"
                :disabled="disabled"
              />
            </FormField>
          </fieldset>

          <fieldset v-if="currentStepNumber === 1">
            <legend>English</legend>

            <FormField
              :has-error="v$details.en.description.$error"
              :error-message="reduceErrors(v$details.en.description.$errors)"
              class="md:col-span-2"
            >
              <textarea
                placeholder="Release description"
                name="description-en"
                rows="10"
                maxlength="10000"
                v-model.trim="stateDetails.en.description"
                :disabled="disabled"
              />
            </FormField>
          </fieldset>

          <button
            v-if="currentStepNumber > 0"
            type="button"
            class="button-custom float-left mt-3 transition-300"
            :class="{ 'opacity-0 relative -z-10': currentStepNumber === 0 }"
            @click="currentStepNumber--"
          >
            <FontAwesomeIcon :icon="['fas', 'angle-left']" class="mr-3" />
            <span>Previous</span>
          </button>

          <button
            v-if="currentStepNumber < formSteps.length - 1"
            type="button"
            class="button-custom float-right mt-3 transition-300"
            :class="{ 'opacity-0 relative -z-10': currentStepNumber === formSteps.length - 1 }"
            @click="currentStepNumber++"
          >
            <span>Next</span>
            <FontAwesomeIcon :icon="['fas', 'angle-right']" class="ml-3" />
          </button>

          <button
            v-if="currentStepNumber === formSteps.length - 1"
            type="submit"
            class="button-custom float-right mt-3 transition-300"
            :class="{ 'opacity-0 relative -z-10': currentStepNumber < formSteps.length - 1 }"
            :disabled="disabled"
          >
            <span>Submit</span>
            <FontAwesomeIcon v-if="!releaseSubmitting" :icon="['fas', 'angles-right']" class="ml-3" />
            <Loader v-else :loading="releaseSubmitting" class="ml-3 text-inherit" />
          </button>
        </form>
      </transition-group>
    </div>
  </transition>
</template>

<style scoped>

</style>
