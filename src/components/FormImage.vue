<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useImage } from '@/composables/image'
import { adminBasePath } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'
import { useEmitter } from '@/plugins/emitter'
import { faWarning } from '@fortawesome/free-solid-svg-icons/faWarning'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { ImagePostData } from '@/types/Image.ts'
import { toast } from 'vue3-toastify'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const { onImageError } = useImage()
const request = useRequest()
const emitter = useEmitter()

const props = defineProps({
  resourceType: {
    type: String,
    required: true
  },
  resourceSlug: {
    type: String,
    required: false,
    default: null
  },
  prefix: {
    type: String,
    required: false,
    default: null
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    required: true
  },
  imageWidth: {
    type: String,
    required: false
  },
  imageHeight: {
    type: String,
    required: false
  },
  submitOnChange: {
    type: Boolean,
    required: false,
    default: false
  },
  stateEvent: {
    type: String,
    required: false
  },
  submitEvent: {
    type: String,
    required: false,
    default: 'submitImage'
  },
  uploadedEvent: {
    type: String,
    required: false,
    default: 'imageUploaded'
  },
  deletable: {
    type: Boolean,
    required: false
  },
  imageError: {
    type: String,
    required: false,
    default: ''
  }
})

const imageUrl = ref(props.imageUrl)
const imageName = ref('')
const imageForm = ref()

const submitting = ref(false)

const imageState = ref()

const disabled = computed(() => {
  return submitting.value ? true : undefined
})

function submitImage(image: File) {
  submitting.value = true

  let content: ImagePostData = {
    resource_type: props.resourceType,
    image: image
  }

  if (props.resourceSlug) {
    content.resource_slug = props.resourceSlug
  }

  if (props.prefix) {
    content.prefix = props.prefix
  }

  request.postRequest(
    {
      uri: adminBasePath + '/image',
      content: content,
      contentType: 'multipart/form-data',
      successMessage: 'Image "' + imageName.value + '" has been uploaded',
      errorMessage: 'Unable to upload image "' + imageName.value + '"'
    }
  ).then(() => {
    submitting.value = false

    emitter.emit(props.uploadedEvent)
  })
}

function changeImage(event: Event | null, fromDelete: boolean = false) {
  if (fromDelete) {
    imageUrl.value = ''
    imageName.value = ''

    if (props.stateEvent) {
      emitter.emit(props.stateEvent, null)
    }

    return
  }

  let target = (event?.target || event?.currentTarget) as HTMLInputElement

  const image = (target && target.files) ? target.files[0] : null
  if (!image) {
    toast('Invalid image', {
      type: toast.TYPE.ERROR
    })
    return
  }

  imageUrl.value = URL.createObjectURL(image)
  imageName.value = image.name

  if (props.stateEvent) {
    emitter.emit(props.stateEvent, image)
  }

  if (props.submitOnChange) {
    submitImage(image)
  } else {
    imageState.value = image
  }
}

function resetImageForm() {
  changeImage(null, true)
}

onMounted(() => {
  emitter.on(props.submitEvent, () => {
    submitImage(imageState.value)
  })
})

onUnmounted(() => {
  emitter.off(props.submitEvent)
})
</script>

<template>
  <transition appear>
    <form novalidate ref="imageForm" class="mx-auto">
      <FormField class="mx-auto inline-block"
                 :has-error="$props.imageError !== ''">
        <label class="relative cursor-pointer inline-block">
          <input type="file" accept="image/jpeg" @change=changeImage :disabled="disabled" />

          <img :src="imageUrl"
               :alt="$props.imageAlt"
               class="rounded-custom border-2 border-neutral-700"
               :class="$props.resourceType"
               @error="onImageError" />

          <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center p-3">
            <div class="custom-file-input !bg-opacity-70 flex flex-row items-stretch gap-3">
              <div class="m-0 my-auto">Browse...</div>
              <div class="pl-3 border-l-[1px] border-neutral-400">{{ imageName }}</div>
            </div>

            <p v-if="$props.imageError"
               class="error-message">
              <FontAwesomeIcon :icon="faWarning" />
              <span>{{ $t($props.imageError) }}</span>
            </p>
          </div>

          <button type="button" v-if="$props.deletable"
                  class="button-custom button-delete absolute top-3 right-3"
                  @click=resetImageForm>
            <span>Delete</span>
            <FontAwesomeIcon :icon="faTrash" class="ml-3" />
          </button>
        </label>
      </FormField>

      <input type="hidden" name="resource_type" :value="$props.resourceType" />
      <input type="hidden" name="resource_slug" :value="$props.resourceSlug" />
    </form>
  </transition>
</template>

<style scoped>

</style>
