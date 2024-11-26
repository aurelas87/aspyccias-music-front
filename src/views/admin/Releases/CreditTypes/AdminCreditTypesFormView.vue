<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { customKey, customRequired, reduceErrors } from '@/composables/validation'
import useVuelidate from '@vuelidate/core'
import Title from '@/components/Title.vue'
import Loader from '@/components/Loader.vue'
import FormField from '@/components/FormField.vue'
import { toast } from 'vue3-toastify'
import { useReleaseCreditTypeService } from '@/services/ReleaseCreditTypeService.ts'
import { useRouter } from 'vue-router'
import type { AdminReleaseCreditTypeData } from '@/types/ReleaseCreditType.ts'

const releaseCreditTypeService = useReleaseCreditTypeService()
const router = useRouter()

const props = defineProps({
  credit_name_key: {
    type: String,
    required: false
  }
})

const state = reactive<AdminReleaseCreditTypeData>({
  credit_name_key: '',
  credit_name_fr: '',
  credit_name_en: ''
})

const loading = ref(false)
const creditTypeUpdating = ref(false)

const disabled = computed(() => {
  return creditTypeUpdating.value ? true : undefined
})

const rules = {
  credit_name_key: { customRequired, customKey },
  credit_name_fr: { customRequired },
  credit_name_en: { customRequired },
}

const v$ = useVuelidate(rules, state)

async function submitReleaseCreditType() {
  creditTypeUpdating.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    creditTypeUpdating.value = false

    return
  }

  (
    (props.credit_name_key)
      ? releaseCreditTypeService.editReleaseCreditType(props.credit_name_key, state)
      : releaseCreditTypeService.addReleaseCreditType(state)
  ).then((releaseCreditTypeResponse: boolean | null) => {
    if (releaseCreditTypeResponse === true) {
      router.push({ name: 'admin.credit-types' })
    }

    creditTypeUpdating.value = false
  })
}

const title = computed(() => {
  const action = props.credit_name_key ? 'Edit' : 'Add'
  return action + ' Release Credit Type'
})

onMounted(async () => {
  if (props.credit_name_key) {
    loading.value = true

    const releaseCreditTypeResponse = await releaseCreditTypeService.getForAdmin(props.credit_name_key).then(r => r)
    if (!releaseCreditTypeResponse) {
      await router.push({ name: 'admin-not-found' })

      return
    }

    state.credit_name_key = releaseCreditTypeResponse.credit_name_key
    state.credit_name_fr = releaseCreditTypeResponse.credit_name_fr
    state.credit_name_en = releaseCreditTypeResponse.credit_name_en

    loading.value = false
  }
})
</script>

<template>
  <transition appear>
    <div>
      <Title :title="title" :level="1" />

      <Loader :loading="loading" />

      <transition appear>
        <form v-if="!loading" novalidate class="sm:w-[80%] xl:w-[60%] mx-auto mt-10"
              @submit.prevent.stop="submitReleaseCreditType">
          <fieldset>
            <legend>New credit type</legend>

            <FormField :has-error="v$.credit_name_key.$error" :error-message="reduceErrors(v$.credit_name_key.$errors)" class="md:col-span-2">
              <input type="text" placeholder="Credit name key" name="credit_name_key" maxlength="255"
                     v-model.trim="state.credit_name_key" :disabled="disabled" />
            </FormField>

            <FormField :has-error="v$.credit_name_fr.$error" :error-message="reduceErrors(v$.credit_name_fr.$errors)" class="md:col-span-2">
              <input type="text" placeholder="Credit name FR" name="credit_name_fr" maxlength="255"
                     v-model.trim="state.credit_name_fr" :disabled="disabled" />
            </FormField>

            <FormField :has-error="v$.credit_name_en.$error" :error-message="reduceErrors(v$.credit_name_en.$errors)" class="md:col-span-2">
              <input type="text" placeholder="Credit name EN" name="credit_name_en" maxlength="255"
                     v-model.trim="state.credit_name_en" :disabled="disabled" />
            </FormField>
          </fieldset>

          <button type="submit" class="button-custom float-right mt-3" :disabled="disabled">
            <span>Submit</span>
            <FontAwesomeIcon v-if="!creditTypeUpdating" :icon="faAnglesRight" class="ml-3" />
            <Loader v-else :loading="creditTypeUpdating" class="ml-3 text-inherit" />
          </button>
        </form>
      </transition>
    </div>
  </transition>
</template>

<style scoped>

</style>
