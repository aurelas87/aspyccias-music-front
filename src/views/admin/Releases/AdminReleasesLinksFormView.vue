<script setup lang="ts">
import Title from '@/components/Title.vue'
import Loader from '@/components/Loader.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useReleaseService } from '@/services/ReleaseService.ts'
import { helpers } from '@vuelidate/validators'
import {
  customReleaseLinkCategory,
  customReleaseLinkCategoryValidator,
  customRequired,
  customUrl,
  reduceErrors
} from '@/composables/validation.ts'
import useVuelidate from '@vuelidate/core'
import { toast } from 'vue3-toastify'
import { faAnglesRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FormField from '@/components/FormField.vue'
import { useReleaseLinkNameService } from '@/services/ReleaseLinkNameService.ts'
import type { AdminReleaseLinkNameData, AdminReleaseLinkNames } from '@/types/ReleaseLinkName.ts'
import { type ReleaseLinkData } from '@/types/Release.ts'
import { ReleaseLinkCategory } from '@/types/ReleaseLinkCategory.ts'

const releaseService = useReleaseService()
const releaseLinkNameService = useReleaseLinkNameService()

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const releaseTitle = ref('')
const loading = ref(true)
const linksSubmitting = ref(false)

const releaseLinkNames = reactive({
  list: <AdminReleaseLinkNames>[]
})

const releaseLinkCategoryChoices = Object.keys(ReleaseLinkCategory).map((name) => {
  const tempValue = ReleaseLinkCategory[name as keyof typeof ReleaseLinkCategory]

  let text = tempValue.split('_')
  text = text.map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))

  return {
    value: tempValue,
    text: text.join(' '),
  };
});

const releaseLinkNameErrors = reactive<boolean[]>([])
const releaseLinkNameErrorMessages = reactive<string[]>([])

const releaseLinkErrors = reactive<boolean[]>([])
const releaseLinkErrorMessages = reactive<string[]>([])

const releaseLinkEmbeddedErrors = reactive<boolean[]>([])
const releaseLinkEmbeddedErrorMessages = reactive<string[]>([])

const state = reactive({
  links: <ReleaseLinkData[]>[]
})

const rules = {
  links: {
    $each: helpers.forEach({
      category: { customReleaseLinkCategory },
      name: { customRequired },
      link: { customUrl }
    })
  }
}

const v$ = useVuelidate(rules, state)

const title = computed(() => {
  return 'Edit "' + releaseTitle.value + '" links'
})

const disabled = computed(() => {
  return linksSubmitting.value ? true : undefined
})

function getReleaseLinkErrorMessage(index: number): string {
  if (releaseLinkErrorMessages[index] !== '') {
    return releaseLinkErrorMessages[index]
  }

  return reduceErrors(v$.value.links.$each.$response.$errors[index].link)
}

function addLink(releaseLinkData?: ReleaseLinkData) {
  if (releaseLinkData) {
    state.links.push(releaseLinkData)
  } else {
    state.links.push({
      category: '',
      name: '',
      link: null,
      embedded: null
    })
  }

  releaseLinkNameErrors.push(false)
  releaseLinkNameErrorMessages.push('')

  releaseLinkEmbeddedErrors.push(false)
  releaseLinkEmbeddedErrorMessages.push('')

  releaseLinkErrors.push(false)
  releaseLinkErrorMessages.push('')

  validateReleaseLinkName(state.links.length - 1)
}

function deleteLink(index: number) {
  state.links.splice(index, 1)

  releaseLinkNameErrors.splice(index, 1)
  releaseLinkNameErrorMessages.splice(index, 1)

  releaseLinkEmbeddedErrors.splice(index, 1)
  releaseLinkEmbeddedErrorMessages.splice(index, 1)

  releaseLinkErrors.splice(index, 1)
  releaseLinkErrorMessages.splice(index, 1)
}

function validateReleaseLinkName(index: number) {
  const isValid = Object.values(releaseLinkNames.list.map((adminReleaseLinkNameData: AdminReleaseLinkNameData) => {
    return adminReleaseLinkNameData.link_name
  })).includes(state.links[index].name)

  if (!isValid) {
    releaseLinkNameErrors[index] = true
    releaseLinkNameErrorMessages[index] = 'validation.release_link_name'
  } else {
    releaseLinkNameErrors[index] = false
    releaseLinkNameErrorMessages[index] = ''
  }
}

function validateLinkOrEmbedded(index: number) {
  releaseLinkEmbeddedErrors[index] = false
  releaseLinkEmbeddedErrorMessages[index] = ''

  releaseLinkErrors[index] = false
  releaseLinkErrorMessages[index] = ''

  if (state.links[index].category === ReleaseLinkCategory.SMART_LINK) {
    if (state.links[index].embedded === null || state.links[index].embedded === '') {
      releaseLinkEmbeddedErrors[index] = true
      releaseLinkEmbeddedErrorMessages[index] = 'validation.required'
    } else {
      releaseLinkEmbeddedErrors[index] = false
      releaseLinkEmbeddedErrorMessages[index] = ''
    }
  } else {
    if (state.links[index].link === null || state.links[index].link === '') {
      releaseLinkErrors[index] = true
      releaseLinkErrorMessages[index] = 'validation.required'
    } else {
      releaseLinkErrors[index] = false
      releaseLinkErrorMessages[index] = ''
    }
  }
}

async function submitLinks() {
  linksSubmitting.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()
    && releaseLinkNameErrors.every((value: boolean) => {
      return !value
    })
    && releaseLinkEmbeddedErrors.every((value: boolean) => {
      return !value
    })
    && releaseLinkErrors.every((value: boolean) => {
      return !value
    })

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    linksSubmitting.value = false

    return
  }

  const uniqueLinks = state.links.map(item => item.category + '_' + item.name)
    .filter((value, index, self) => self.indexOf(value) === index)
  if (state.links.length > uniqueLinks.length) {
    toast('Unique errors: Check that all the "Category" and "Name" combinations are unique', {
      type: toast.TYPE.WARNING
    })

    linksSubmitting.value = false

    return
  }

  releaseService.editLinks(props.slug, releaseTitle.value, state)
    .then(() => {
      linksSubmitting.value = false
      fetchData()
    })
}

async function fetchData() {
  loading.value = true

  const adminReleaseLinksResponse = await releaseService.getLinksForAdmin(props.slug).then((r) => r)
  if (!adminReleaseLinksResponse) {
    toast('No release link found', {
      type: toast.TYPE.WARNING
    })

    loading.value = false

    return
  }

  releaseTitle.value = adminReleaseLinksResponse.title

  state.links.splice(0)
  adminReleaseLinksResponse.links.forEach((releaseLinkData: ReleaseLinkData) => {
    addLink(releaseLinkData)
  })

  loading.value = false
}

onMounted(async () => {
  const adminReleaseLinkNamesResponse = await releaseLinkNameService.getAllForAdmin().then((r) => r)
  if (!adminReleaseLinkNamesResponse) {
    toast('No release link names found', {
      type: toast.TYPE.WARNING
    })

    loading.value = false

    return
  }

  adminReleaseLinkNamesResponse.forEach((adminReleaseLinkNameData: AdminReleaseLinkNameData) => {
    releaseLinkNames.list.push(adminReleaseLinkNameData)
  })

  await fetchData()
})
</script>

<template>
  <transition appear>
    <div>
      <Loader :loading="loading" />

      <Title v-if="!loading" :title="title" :level="1" />

      <form v-if="!loading" novalidate class="w-full mx-auto"
            @submit.prevent.stop="submitLinks">
        <table class="w-full">
          <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Link</th>
            <th>Embedded</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(link, index) in state.links">
            <td>
              <FormField
                :has-error="v$.links.$each.$response.$data[index].category.$error"
                :error-message="reduceErrors(v$.links.$each.$response.$errors[index].category)"
                class="md:col-span-2"
              >
                <select
                  :name="'category-' + index"
                  v-model="link.category"
                  :disabled="disabled"
                  :class="{ 'text-gray-400': !(customReleaseLinkCategoryValidator(link.category || '')) }"
                  @change="validateLinkOrEmbedded(index)"
                >
                  <option :selected="true" value="" :disabled="true" hidden>Category</option>
                  <option v-for="releaseLinkCategoryChoice in releaseLinkCategoryChoices" :value="releaseLinkCategoryChoice.value">
                    {{ releaseLinkCategoryChoice.text }}
                  </option>
                </select>
              </FormField>
            </td>
            <td>
              <FormField
                :has-error="releaseLinkNameErrors[index]"
                :error-message="releaseLinkNameErrorMessages[index]"
              >
                <select
                  :name="'name-' + index"
                  v-model="link.name"
                  :disabled="disabled"
                  :class="{ 'text-gray-400': releaseLinkNameErrors[index] }"
                  @change="validateReleaseLinkName(index)"
                >
                  <option :selected="true" value="" :disabled="true" hidden>Name</option>
                  <option v-for="releaseLinkName in releaseLinkNames.list" :value="releaseLinkName.link_name">
                    {{ releaseLinkName.link_name }}
                  </option>
                </select>
              </FormField>
            </td>
            <td>
              <FormField
                :has-error="v$.links.$each.$response.$data[index].link.$error || releaseLinkErrors[index]"
                :error-message="getReleaseLinkErrorMessage(index)"
              >
                <input
                  type="text"
                  placeholder="Link"
                  :name="'link-' + index"
                  maxlength="255"
                  v-model.trim="link.link"
                  :disabled="disabled || link.category === ReleaseLinkCategory.SMART_LINK"
                  @keyup="validateLinkOrEmbedded(index)"
                />
              </FormField>
            </td>
            <td>
              <FormField
                :has-error="releaseLinkEmbeddedErrors[index]"
                :error-message="releaseLinkEmbeddedErrorMessages[index]"
              >
                <input
                  type="text"
                  placeholder="Embedded"
                  :name="'embedded-' + index"
                  maxlength="10000"
                  v-model.trim="link.embedded"
                  :disabled="disabled || link.category !== ReleaseLinkCategory.SMART_LINK"
                  @keyup="validateLinkOrEmbedded(index)"
                />
              </FormField>
            </td>
            <td>
              <button type="button" class="button-custom button-delete ml-1" @click="deleteLink(index)">
                <span>Delete</span>
                <FontAwesomeIcon :icon="faTrash" class="ml-3" />
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="p-0">
              <button type="button" class="w-full button-custom button-add !rounded-none"
                      @click="addLink()">
                <span>Add a link</span>
                <FontAwesomeIcon :icon="faPlus" class="ml-3" />
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <button type="submit" class="button-custom float-right mt-3" :disabled="disabled">
          <span>Submit</span>
          <FontAwesomeIcon v-if="!linksSubmitting" :icon="faAnglesRight" class="ml-3" />
          <Loader v-else :loading="linksSubmitting" class="ml-3 text-inherit" />
        </button>
      </form>
    </div>
  </transition>
</template>

<style scoped>

</style>
