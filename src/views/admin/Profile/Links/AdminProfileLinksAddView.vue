<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
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

const profileLinkService = useProfileLinkService()
const router = useRouter()

const state = reactive<NewProfileLinkData>({
  name: '',
  link: ''
})

const linkCreating = ref(false)

const disabled = computed(() => {
  return linkCreating.value ? true : undefined
})

const rules = {
  name: { customRequired },
  link: { customRequired, customUrl }
}

const v$ = useVuelidate(rules, state)

async function submitProfileLink() {
  linkCreating.value = true

  v$.value.$reset()

  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    linkCreating.value = false

    return
  }

  profileLinkService.addProfileLink(state).then((profileLinkAddResponse: boolean | null) => {
    if (profileLinkAddResponse === true) {
      router.push({ name: 'admin.links' })
    }

    linkCreating.value = false
  })
}
</script>

<template>
  <transition appear>
    <div>
      <Title title="Add Profile Link" :level="1" />

      <form novalidate class="sm:w-[80%] xl:w-[60%] mx-auto mt-10" @submit.prevent.stop="submitProfileLink">
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
          <FontAwesomeIcon v-if="!linkCreating" :icon="faAnglesRight" class="ml-3" />
          <Loader v-else :loading="linkCreating" class="ml-3 text-inherit" />
        </button>
      </form>
    </div>
  </transition>
</template>

<style scoped>

</style>
