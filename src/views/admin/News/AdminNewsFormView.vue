<script setup lang="ts">
import Title from '@/components/Title.vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import Loader from '@/components/Loader.vue'
import { customDate, customRequired, customSlug, reduceErrors } from '@/composables/validation'
import useVuelidate from '@vuelidate/core'
import { toast } from 'vue3-toastify'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import FormField from '@/components/FormField.vue'
import FormImage from '@/components/FormImage.vue'
import { useNewsService } from '@/services/NewsService'
import { useEmitter } from '@/plugins/emitter'
import type { ImagesState } from '@/types/admin/Commons'
import type { FormStep, FormSteps } from '@/types/admin/FormStep.ts'
import { useRouter } from 'vue-router'
import type { NewsData } from '@/types/News.ts'
import { useAdminNewsMapper } from '@/mappers/News/AdminNewsMapper.ts'
import AdminNewsDetails from '@/models/News/AdminNewsDetails.ts'

const newsService = useNewsService()
const emitter = useEmitter()
const router = useRouter()
const adminNewsMapper = useAdminNewsMapper()

library.add(fas)
library.add(far)

const props = defineProps({
  slug: {
    type: String,
    required: false
  }
})

const formSteps = reactive<FormSteps>([
  { name: 'date', icon: 'calendar-days', error: false },
  { name: 'content', icon: 'newspaper', error: false },
  { name: 'preview', icon: 'image', error: false }
])

const stateDate = reactive({
  date: '',
  slug: ''
})

const stateContent = reactive({
  fr: {
    title: '',
    content: ''
  },
  en: {
    title: '',
    content: ''
  }
})

const statePreview = reactive<ImagesState>({
  previewImage: null
})

const rulesDate = {
  date: { customRequired, customDate },
  slug: { customRequired, customSlug }
}

const rulesContent = {
  fr: {
    title: { customRequired },
    content: { customRequired }
  },
  en: {
    title: { customRequired },
    content: { customRequired }
  }
}

const v$date = useVuelidate(rulesDate, stateDate)
const v$content = useVuelidate(rulesContent, stateContent)

const loading = ref(false)
const currentStepNumber = ref(0)
const newsSubmitting = ref(false)

const adminNewsDetails = reactive<AdminNewsDetails>(new AdminNewsDetails())
const previewImageError = ref('')

const title = computed(() => {
  const action = props.slug ? 'Edit' : 'Add'
  return action + ' News'
})

const disabled = computed(() => {
  return newsSubmitting.value ? true : undefined
})

async function validateStep(step: number) {
  if (step === 2) {
    formSteps[2].error = false
    previewImageError.value = ''

    if (!props.slug && !(statePreview.previewImage instanceof File)) {
      formSteps[2].error = true
      previewImageError.value = 'validation.required'
    }

    return
  }

  let validator = null
  switch (step) {
    case 0:
      validator = v$date
      break
    case 1:
      validator = v$content
      break
  }

  if (!validator) {
    return
  }

  validator.value.$reset()
  await validator.value.$validate()

  formSteps[step].error = validator.value.$error
}

async function submitNews() {
  newsSubmitting.value = true

  for (let stepNumber: number = 0; stepNumber < formSteps.length; stepNumber++) {
    await validateStep(stepNumber)
  }

  const isFormValid = formSteps.every((thisStep: FormStep) => !thisStep.error)

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    newsSubmitting.value = false

    return
  }

  const data: NewsData = {
    date: stateDate.date,
    slug: stateDate.slug,
    fr: stateContent.fr,
    en: stateContent.en,
  };

  (
    (props.slug)
      ? newsService.editNews(props.slug, data)
      : newsService.addNews(data)
  ).then(async (newsResponse: boolean | null) => {
    if (newsResponse === true) {
      if (props.slug) {
        const newsDetailsResponse = await newsService.get(data.slug).then(r => r)
        if (!newsDetailsResponse) {
          await router.push({ name: 'admin-not-found' })
        }
      }

      if (!props.slug || statePreview.previewImage instanceof File) {
        emitter.emit('submitImage')
      } else {
        await router.push({ name: 'admin.news' })
      }
    }

    newsSubmitting.value = false
  })
}

function stepCheckIcon(stepNumber: number): string {
  return formSteps[stepNumber].error ? 'circle-exclamation' : 'circle-check'
}

const previewImageChangedEvent = 'previewImageChanged'
const imageUploadedEvent = 'imageUploaded'

onMounted(async () => {
  if (props.slug) {
    loading.value = true

    const adminNewsDetailsResponse = await newsService.getForAdmin(props.slug).then(r => r)
    if (!adminNewsDetailsResponse) {
      await router.push({ name: 'admin-not-found' })

      return
    }

    adminNewsMapper.mapAdminResponseToNewsDetails(adminNewsDetailsResponse, adminNewsDetails)

    const date = new Date(adminNewsDetailsResponse.date)
    stateDate.date = date.getFullYear()
      + '-' + (date.getMonth() + 1).toString().padStart(2, '0')
      + '-' + date.getDate().toString().padStart(2, '0')

    stateDate.slug = adminNewsDetailsResponse.slug

    stateContent.fr.title = adminNewsDetailsResponse.title_fr
    stateContent.fr.content = adminNewsDetailsResponse.content_fr
    stateContent.en.title = adminNewsDetailsResponse.title_en
    stateContent.en.content = adminNewsDetailsResponse.content_en

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

  emitter.on(previewImageChangedEvent, (previewImage: File) => {
    statePreview.previewImage = previewImage
    validateStep(2)
  })

  emitter.on(imageUploadedEvent, async () => {
    await router.push({ name: 'admin.news' })
  })
})

onUnmounted(() => {
  emitter.off(previewImageChangedEvent)
  emitter.off(imageUploadedEvent)
})
</script>

<template>
  <transition appear>
    <div>
      <Title :title="title" :level="1" />

      <Loader :loading="loading" />

      <transition-group appear>
        <ol v-if="!loading" class="grid grid-flow-col justify-center sm:w-[80%] xl:w-[60%] mx-auto">
          <li v-for="(formStep, stepNumber) in formSteps" class="flex flex-row items-center grow">
            <hr v-if="stepNumber > 0"
                class="w-10 h-2 border-0 transition-300"
                :class="{ 'bg-primary/80': currentStepNumber >= stepNumber, 'bg-neutral-700/80': currentStepNumber < stepNumber }" />

            <p class="m-0 leading-none w-fit relative cursor-pointer">
              <FontAwesomeIcon
                :icon="['fas', formStep.icon]"
                class="w-5 h-5 p-5 rounded-[100%] relative transition-300 border-2 border-transparent bg-neutral-700/80"
                :class="{ 'text-primary/80 !border-primary/80': currentStepNumber === stepNumber, '!bg-primary/80': currentStepNumber > stepNumber }"
                @click="currentStepNumber = stepNumber" />
              <FontAwesomeIcon :icon="['fas', stepCheckIcon(stepNumber)]"
                               class="absolute right-0 top-0 rounded-[100%] transition-300"
                               :class="{ 'opacity-0': currentStepNumber <= stepNumber, 'text-success': !formSteps[stepNumber].error, 'text-error': formSteps[stepNumber].error }" />
            </p>

            <hr v-if="stepNumber < formSteps.length - 1"
                class="w-10 h-2 border-0 transition-300"
                :class="{ '!bg-primary/80': currentStepNumber > stepNumber, 'bg-neutral-700/80': currentStepNumber <= stepNumber }" />
          </li>
        </ol>

        <FormImage v-if="!loading" image-alt="News preview"
                   :image-url="newsService.getNewsImageUri(adminNewsDetails)"
                   image-width="960px"
                   image-height="540px"
                   resource-type="news"
                   :resource-slug="stateDate.slug"
                   :stateEvent="previewImageChangedEvent"
                   :image-error="previewImageError"
                   :class="{ 'absolute opacity-0 -z-50': currentStepNumber !== 2, 'mt-10': currentStepNumber === 2 }" />

        <form v-if="!loading" novalidate class="sm:w-[80%] xl:w-[60%] mx-auto"
              :class="{ 'mt-10': currentStepNumber !== 2 }"
              @submit.prevent.stop="submitNews">
          <fieldset v-if="currentStepNumber === 0">
            <legend>Date and slug</legend>

            <FormField :has-error="v$date.date.$error" :error-message="reduceErrors(v$date.date.$errors)"
                       class="md:col-span-2">
              <input type="text" placeholder="YYYY-MM-DD" name="date" maxlength="10"
                     v-model.trim="stateDate.date" :disabled="disabled" />
            </FormField>

            <FormField :has-error="v$date.slug.$error" :error-message="reduceErrors(v$date.slug.$errors)"
                       class="md:col-span-2">
              <input type="text" placeholder="news-custom-slug" name="slug" maxlength="255"
                     v-model.trim="stateDate.slug" :disabled="disabled" />
            </FormField>
          </fieldset>

          <fieldset v-if="currentStepNumber === 1">
            <legend>French</legend>

            <FormField :has-error="v$content.fr.title.$error" :error-message="reduceErrors(v$content.fr.title.$errors)"
                       class="md:col-span-2">
              <input type="text" placeholder="Titre de l'actualité" name="title-fr" maxlength="255"
                     v-model.trim="stateContent.fr.title" :disabled="disabled" />
            </FormField>

            <FormField :has-error="v$content.fr.content.$error" :error-message="reduceErrors(v$content.fr.content.$errors)"
                       class="md:col-span-2">
                <textarea placeholder="Contenu de l'actualité" name="content-fr" rows="10" maxlength="10000"
                          v-model.trim="stateContent.fr.content" :disabled="disabled" />
            </FormField>
          </fieldset>

          <fieldset v-if="currentStepNumber === 1">
            <legend>English</legend>

            <FormField :has-error="v$content.en.title.$error" :error-message="reduceErrors(v$content.en.title.$errors)"
                       class="md:col-span-2">
              <input type="text" placeholder="News title" name="title-en" maxlength="255"
                     v-model.trim="stateContent.en.title" :disabled="disabled" />
            </FormField>

            <FormField :has-error="v$content.en.content.$error" :error-message="reduceErrors(v$content.en.content.$errors)"
                       class="md:col-span-2">
                <textarea placeholder="News content" name="content-en" rows="10" maxlength="10000"
                          v-model.trim="stateContent.en.content" :disabled="disabled" />
            </FormField>
          </fieldset>

          <button v-if="currentStepNumber > 0" type="button"
                  class="button-custom float-left mt-3 transition-300"
                  :class="{ 'opacity-0 relative -z-10': currentStepNumber === 0 }"
                  @click="currentStepNumber--">
            <FontAwesomeIcon :icon="['fas', 'angle-left']" class="mr-3" />
            <span>Previous</span>
          </button>

          <button v-if="currentStepNumber < formSteps.length - 1" type="button"
                  class="button-custom float-right mt-3 transition-300"
                  :class="{ 'opacity-0 relative -z-10': currentStepNumber === formSteps.length - 1 }"
                  @click="currentStepNumber++">
            <span>Next</span>
            <FontAwesomeIcon :icon="['fas', 'angle-right']" class="ml-3" />
          </button>

          <button v-if="currentStepNumber === formSteps.length - 1" type="submit"
                  class="button-custom float-right mt-3 transition-300"
                  :class="{ 'opacity-0 relative -z-10': currentStepNumber < formSteps.length - 1 }"
                  :disabled="disabled">
            <span>Submit</span>
            <FontAwesomeIcon v-if="!newsSubmitting" :icon="['fas', 'angles-right']" class="ml-3" />
            <Loader v-else :loading="newsSubmitting" class="ml-3 text-inherit" />
          </button>
        </form>
      </transition-group>
    </div>
  </transition>
</template>

<style scoped>

</style>
