<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import { ref } from 'vue'
import { useImage } from '@/composables/image'
import { adminBasePath } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'

const { onImageError } = useImage()
const request = useRequest()

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
  imageUrl: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    required: true
  }
})

const imageUrl = ref(props.imageUrl)
const imageName = ref()
const imageForm = ref()

function changeImage(event: Event) {
  const target = event.target || event.currentTarget

  const image = target?.files[0]

  imageUrl.value = URL.createObjectURL(image)
  imageName.value = image.name

  let content = {
    resource_type: props.resourceType,
    image: image
  }

  if (props.resourceSlug) {
    content.resources_slug = props.resourceSlug
  }

  request.postRequest(
    {
      uri: adminBasePath + '/image',
      content: content,
      contentType: 'multipart/form-data',
      successMessage: 'Image has been uploaded',
      errorMessage: 'Unable to upload image'
    }
  )
}
</script>

<template>
  <transition appear>
    <form novalidate ref="imageForm">
      <FormField class="mx-auto inline-block">
        <label class="relative cursor-pointer inline-block">
          <input type="file" accept="image/jpeg" size="" @change=changeImage />

          <img :src="imageUrl"
               :alt="$props.imageAlt"
               class="w-[400px] h-[484px] rounded-custom border-2 border-neutral-700"
               @error="onImageError" />

          <div class="absolute w-full h-full top-0 left-0 flex flex-col justify-center p-3">
            <div class="custom-file-input !bg-opacity-70 flex flex-row items-stretch gap-3">
              <div class="m-0 my-auto">Browse...</div>
              <div class="pl-3 border-l-[1px] border-neutral-400">{{ imageName }}</div>
            </div>
          </div>
        </label>
      </FormField>

      <input type="hidden" name="resource_type" :value="$props.resourceType" />
      <input type="hidden" name="resource_slug" :value="$props.resourceSlug" />
    </form>
  </transition>
</template>

<style scoped>

</style>
