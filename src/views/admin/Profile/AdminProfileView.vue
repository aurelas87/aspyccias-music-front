<script setup lang="ts">
import Title from '@/components/Title.vue'
import { useProfileService } from '@/services/ProfileService'
import { computed, onMounted, reactive, ref } from 'vue'
import { customRequired, reduceErrors } from '@/composables/validation'
import useVuelidate from '@vuelidate/core'
import FormField from '@/components/FormField.vue'
import Loader from '@/components/Loader.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'vue3-toastify'
import FormImage from '@/components/FormImage.vue'

const profileService = useProfileService()

const state = reactive({
  fr: {
    welcome: '',
    description: ''
  },
  en: {
    welcome: '',
    description: ''
  },
  profilePicture: null
})

const loading = ref(true)
const profileUpdating = ref(false)

const disabled = computed(() => {
  return profileUpdating.value ? true : undefined
})

const rules = {
  fr: {
    description: { customRequired }
  },
  en: {
    description: { customRequired }
  },
  profilePicture: {}
}

const v$ = useVuelidate(rules, state)

async function submitProfile() {
  profileUpdating.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    profileUpdating.value = false

    return
  }

  profileService.updateProfile({ fr: state.fr, en: state.en }).then((profileUpdated: boolean | null) => {
    if (profileUpdated) {
      v$.value.$reset()
    }

    profileUpdating.value = false
  })
}

onMounted(async () => {
  loading.value = true

  const adminProfileResponse = await profileService.getForAdmin().then(r => r)
  if (adminProfileResponse) {
    state.fr = adminProfileResponse.fr
    state.en = adminProfileResponse.en
  }

  loading.value = false
})
</script>

<template>
  <main>
    <Title title="Edit Profile" :level="1" />

    <Loader :loading="loading" />

    <FormImage v-if="!loading" image-alt="Aspyccias profile picture" :image-url="profileService.getProfilePictureUri()"
               resource-type="profile" />

    <transition appear>
      <form v-if="!loading" novalidate class="sm:w-[80%] xl:w-[60%] mx-auto mt-10" @submit.prevent.stop="submitProfile">
        <fieldset>
          <legend>French</legend>

          <FormField class="md:col-span-2">
            <input type="text" placeholder="Welcome message" name="welcome-message-fr" maxlength="255"
                   v-model.trim="state.fr.welcome" :disabled="disabled" />
          </FormField>

          <FormField :has-error="v$.fr.description.$error" :error-message="reduceErrors(v$.fr.description.$errors)"
                     class="md:col-span-2">
          <textarea placeholder="Description" name="description-fr" rows="10" maxlength="10000"
                    v-model.trim="state.fr.description" :disabled="disabled" />
          </FormField>
        </fieldset>

        <fieldset>
          <legend>English</legend>

          <FormField class="md:col-span-2">
            <input type="text" placeholder="Welcome message" name="welcome-message-fr" maxlength="255"
                   v-model.trim="state.en.welcome" :disabled="disabled" />
          </FormField>

          <FormField :has-error="v$.en.description.$error" :error-message="reduceErrors(v$.fr.description.$errors)"
                     class="md:col-span-2">
          <textarea placeholder="Description" name="description-en" rows="10" maxlength="10000"
                    v-model.trim="state.en.description" :disabled="disabled" />
          </FormField>
        </fieldset>

        <button type="submit" class="button-custom float-right mt-3" :disabled="disabled">
          <span>Submit</span>
          <FontAwesomeIcon v-if="!profileUpdating" :icon="faAnglesRight" class="ml-3" />
          <Loader v-else :loading="profileUpdating" class="ml-3 text-inherit" />
        </button>
      </form>
    </transition>
  </main>
</template>

<style scoped>

</style>
