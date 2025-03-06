<script setup lang="ts">
import Title from '@/components/Title.vue'
import Loader from '@/components/Loader.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useReleaseService } from '@/services/ReleaseService.ts'
import type { ReleaseCreditData } from '@/types/Release.ts'
import { helpers } from '@vuelidate/validators'
import { customRequired, customUrl, reduceErrors } from '@/composables/validation.ts'
import useVuelidate from '@vuelidate/core'
import { toast } from 'vue3-toastify'
import { faAnglesRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useReleaseCreditTypeService } from '@/services/ReleaseCreditTypeService.ts'
import type { AdminReleaseCreditTypeData, AdminReleaseCreditTypes } from '@/types/ReleaseCreditType.ts'
import FormField from '@/components/FormField.vue'

const releaseService = useReleaseService()
const releaseCreditTypeService = useReleaseCreditTypeService()

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const releaseTitle = ref('')
const loading = ref(true)
const creditsSubmitting = ref(false)

const releaseCreditTypes = reactive({
  list: <AdminReleaseCreditTypes>[]
})

const releaseCreditTypeErrors = reactive<boolean[]>([])
const releaseCreditTypeErrorMessages = reactive<string[]>([])

const state = reactive({
  credits: <ReleaseCreditData[]>[]
})

const rules = {
  credits: {
    $each: helpers.forEach({
      full_name: { customRequired },
      link: { customUrl }
    })
  }
}

const v$ = useVuelidate(rules, state)

const title = computed(() => {
  return 'Edit "' + releaseTitle.value + '" credits'
})

const disabled = computed(() => {
  return creditsSubmitting.value ? true : undefined
})

function addCredit(adminReleaseCreditData?: ReleaseCreditData) {
  if (adminReleaseCreditData) {
    state.credits.push(adminReleaseCreditData)
  } else {
    state.credits.push({
      full_name: '',
      link: null,
      type: ''
    })
  }

  releaseCreditTypeErrors.push(false)
  releaseCreditTypeErrorMessages.push('')

  validateReleaseCreditType(state.credits.length - 1)
}

function deleteCredit(index: number) {
  state.credits.splice(index, 1)

  releaseCreditTypeErrors.splice(index, 1)
  releaseCreditTypeErrorMessages.splice(index, 1)
}

function validateReleaseCreditType(index: number) {
  const isValid = Object.values(releaseCreditTypes.list.map((releaseCreditType: AdminReleaseCreditTypeData) => {
    return releaseCreditType.credit_name_key
  })).includes(state.credits[index].type)

  if (!isValid) {
    releaseCreditTypeErrors[index] = true
    releaseCreditTypeErrorMessages[index] = 'validation.release_credit_type'
  } else {
    releaseCreditTypeErrors[index] = false
    releaseCreditTypeErrorMessages[index] = ''
  }
}

async function submitCredits() {
  creditsSubmitting.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()
    && releaseCreditTypeErrors.every((value: boolean) => {
      return !value
    })

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    creditsSubmitting.value = false

    return
  }

  const uniqueCredits = state.credits.map(item => item.type + '_' + item.full_name.toLowerCase())
    .filter((value, index, self) => self.indexOf(value) === index)
  if (state.credits.length > uniqueCredits.length) {
    toast('Unique errors: Check that all the "Type" and "Full name" combinations are unique', {
      type: toast.TYPE.WARNING
    })

    creditsSubmitting.value = false

    return
  }

  releaseService.editCredits(props.slug, releaseTitle.value, state)
    .then(() => {
      creditsSubmitting.value = false
      fetchData()
    })
}

async function fetchData() {
  loading.value = true

  const adminReleaseCreditsResponse = await releaseService.getCreditsForAdmin(props.slug).then((r) => r)
  if (!adminReleaseCreditsResponse) {
    toast('No release credit found', {
      type: toast.TYPE.WARNING
    })

    loading.value = false

    return
  }

  releaseTitle.value = adminReleaseCreditsResponse.title

  state.credits.splice(0)
  adminReleaseCreditsResponse.credits.forEach((adminReleaseCreditData: ReleaseCreditData) => {
    addCredit(adminReleaseCreditData)
  })

  loading.value = false
}

onMounted(async () => {
  const adminReleaseCreditTypesResponse = await releaseCreditTypeService.getAllForAdmin().then((r) => r)
  if (!adminReleaseCreditTypesResponse) {
    toast('No credit types found', {
      type: toast.TYPE.WARNING
    })

    loading.value = false

    return
  }

  adminReleaseCreditTypesResponse.forEach((adminReleaseCreditTypeData: AdminReleaseCreditTypeData) => {
    releaseCreditTypes.list.push(adminReleaseCreditTypeData)
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
            @submit.prevent.stop="submitCredits">
        <table class="w-full">
          <thead>
          <tr>
            <th>Type</th>
            <th>Full name</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(credit, index) in state.credits">
            <td>
              <FormField
                :has-error="releaseCreditTypeErrors[index]"
                :error-message="releaseCreditTypeErrorMessages[index]"
              >
                <select
                  :name="'type-' + index"
                  v-model="credit.type"
                  :disabled="disabled"
                  :class="{ 'text-gray-400': releaseCreditTypeErrors[index] }"
                  @change="validateReleaseCreditType(index)"
                >
                  <option :selected="true" value="" :disabled="true" hidden>Type</option>
                  <option v-for="releaseCreditType in releaseCreditTypes.list" :value="releaseCreditType.credit_name_key">
                    {{ releaseCreditType.credit_name_en }}
                  </option>
                </select>
              </FormField>
            </td>
            <td>
              <FormField
                :has-error="v$.credits.$each.$response.$data[index].full_name.$error"
                :error-message="reduceErrors(v$.credits.$each.$response.$errors[index].full_name)"
              >
                <input
                  type="text"
                  placeholder="Full name"
                  :name="'full-name-' + index"
                  maxlength="255"
                  v-model.trim="credit.full_name"
                  :disabled="disabled"
                />
              </FormField>
            </td>
            <td>
              <FormField
                :has-error="v$.credits.$each.$response.$errors[index].link.length"
                :error-message="reduceErrors(v$.credits.$each.$response.$errors[index].link)"
              >
                <input
                  type="text"
                  placeholder="Link"
                  :name="'link-' + index"
                  maxlength="255"
                  v-model.trim="credit.link"
                  :disabled="disabled"
                />
              </FormField>
            </td>
            <td>
              <button type="button" class="button-custom button-delete ml-1" @click="deleteCredit(index)">
                <span>Delete</span>
                <FontAwesomeIcon :icon="faTrash" class="ml-3" />
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="p-0">
              <button type="button" class="w-full button-custom button-add !rounded-none"
                      @click="addCredit()">
                <span>Add a credit</span>
                <FontAwesomeIcon :icon="faPlus" class="ml-3" />
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <button type="submit" class="button-custom float-right mt-3" :disabled="disabled">
          <span>Submit</span>
          <FontAwesomeIcon v-if="!creditsSubmitting" :icon="faAnglesRight" class="ml-3" />
          <Loader v-else :loading="creditsSubmitting" class="ml-3 text-inherit" />
        </button>
      </form>
    </div>
  </transition>
</template>

<style scoped>

</style>
