<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { customRequired, customUrl, reduceErrors } from '@/composables/validation'
import useVuelidate from '@vuelidate/core'
import Title from '@/components/Title.vue'
import Loader from '@/components/Loader.vue'
import FormField from '@/components/FormField.vue'
import { toast } from 'vue3-toastify'
import { useProfileLinkService } from '@/services/ProfileLinkService'
import { useRouter } from 'vue-router'
import type { ProfileLinkData } from '@/types/ProfileLink.ts'

const profileLinkService = useProfileLinkService()
const router = useRouter()

const props = defineProps({
  name: {
    type: String,
    required: false
  }
})

const state = reactive<ProfileLinkData>({
  name: '',
  link: ''
})

const loading = ref(false)
const linkUpdating = ref(false)

const disabled = computed(() => {
  return linkUpdating.value ? true : undefined
})

const rules = {
  name: { customRequired },
  link: { customRequired, customUrl }
}

const v$ = useVuelidate(rules, state)

async function submitProfileLink() {
  linkUpdating.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    linkUpdating.value = false

    return
  }

  (
    (props.name)
      ? profileLinkService.editProfileLink(props.name, state)
      : profileLinkService.addProfileLink(state)
  ).then((profileLinkResponse: boolean | null) => {
    if (profileLinkResponse === true) {
      router.push({ name: 'admin.links' })
    }

    linkUpdating.value = false
  })
}

const title = computed(() => {
  const action = props.name ? 'Edit' : 'Add'
  return action + ' Profile Link'
})

onMounted(async () => {
  if (props.name) {
    loading.value = true

    const ProfileLinkResponse = await profileLinkService.getForAdmin(props.name).then(r => r)
    if (!ProfileLinkResponse) {
      await router.push({ name: 'admin-not-found' })

      return
    }

    state.name = ProfileLinkResponse.name
    state.link = ProfileLinkResponse.link

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
              @submit.prevent.stop="submitProfileLink">
          <fieldset>
            <legend>New link</legend>

            <FormField :has-error="v$.name.$error" :error-message="reduceErrors(v$.name.$errors)" class="md:col-span-2">
              <input type="text" placeholder="Name" name="name" maxlength="20"
                     v-model.trim="state.name" :disabled="disabled" />
            </FormField>

            <FormField :has-error="v$.link.$error" :error-message="reduceErrors(v$.link.$errors)" class="md:col-span-2">
              <input type="text" placeholder="Link" name="link" maxlength="255"
                     v-model.trim="state.link" :disabled="disabled" />
            </FormField>
          </fieldset>

          <button type="submit" class="button-custom float-right mt-3" :disabled="disabled">
            <span>Submit</span>
            <FontAwesomeIcon v-if="!linkUpdating" :icon="faAnglesRight" class="ml-3" />
            <Loader v-else :loading="linkUpdating" class="ml-3 text-inherit" />
          </button>
        </form>
      </transition>
    </div>
  </transition>
</template>

<style scoped>

</style>
