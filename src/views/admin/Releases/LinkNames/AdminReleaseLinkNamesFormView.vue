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
import { useRouter } from 'vue-router'
import { useReleaseLinkNameService } from '@/services/ReleaseLinkNameService.ts'
import type { AdminReleaseLinkNameData } from '@/types/ReleaseLinkName.ts'

const releaseLinkNameService = useReleaseLinkNameService()
const router = useRouter()

const props = defineProps({
  link_name: {
    type: String,
    required: false
  }
})

const state = reactive<AdminReleaseLinkNameData>({
  link_name: ''
})

const loading = ref(false)
const releaseLinkNameUpdating = ref(false)

const disabled = computed(() => {
  return releaseLinkNameUpdating.value ? true : undefined
})

const rules = {
  link_name: { customRequired, customKey },
}

const v$ = useVuelidate(rules, state)

async function submitReleaseLinkName() {
  releaseLinkNameUpdating.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    releaseLinkNameUpdating.value = false

    return
  }

  (
    (props.link_name)
      ? releaseLinkNameService.editReleaseLinkName(props.link_name, state)
      : releaseLinkNameService.addReleaseLinkName(state)
  ).then((releaseLinkNameResponse: boolean | null) => {
    if (releaseLinkNameResponse === true) {
      router.push({ name: 'admin.release-link-names' })
    }

    releaseLinkNameUpdating.value = false
  })
}

const title = computed(() => {
  const action = props.link_name ? 'Edit' : 'Add'
  return action + ' Release Link Name'
})

onMounted(async () => {
  if (props.link_name) {
    loading.value = true

    const releaseLinkNameResponse = await releaseLinkNameService.getForAdmin(props.link_name).then(r => r)
    if (!releaseLinkNameResponse) {
      await router.push({ name: 'admin-not-found' })

      return
    }

    state.link_name = releaseLinkNameResponse.link_name

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
              @submit.prevent.stop="submitReleaseLinkName">
          <fieldset>
            <legend>New link name</legend>

            <FormField :has-error="v$.link_name.$error" :error-message="reduceErrors(v$.link_name.$errors)" class="md:col-span-2">
              <input type="text" placeholder="Link name" name="link_name" maxlength="255"
                     v-model.trim="state.link_name" :disabled="disabled" />
            </FormField>
          </fieldset>

          <button type="submit" class="button-custom float-right mt-3" :disabled="disabled">
            <span>Submit</span>
            <FontAwesomeIcon v-if="!releaseLinkNameUpdating" :icon="faAnglesRight" class="ml-3" />
            <Loader v-else :loading="releaseLinkNameUpdating" class="ml-3 text-inherit" />
          </button>
        </form>
      </transition>
    </div>
  </transition>
</template>

<style scoped>

</style>
