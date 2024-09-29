<script setup lang="ts">
import Title from '@/components/Title.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane'
import { reactive, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { customEmail, customRequired, reduceErrors } from '@/composables/validation'
import useVuelidate from '@vuelidate/core'
import FormField from '@/components/FormField.vue'
import { useI18n } from 'vue-i18n'
import { useContactService } from '@/services/ContactService'
import Loader from '@/components/Loader.vue'

const state = reactive({
  firstName: '',
  lastName: '',
  emailAddress: '',
  subject: '',
  message: ''
})

const emailSending = ref(false)

const rules = {
  firstName: { customRequired },
  lastName: { customRequired },
  emailAddress: { customRequired, customEmail },
  subject: { customRequired },
  message: { customRequired }
}

const v$ = useVuelidate(rules, state)

const i18n = useI18n()
const contactService = useContactService()

async function submitEmail() {
  emailSending.value = true;

  v$.value.$reset()
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast(i18n.t('validation.invalid_data'), {
      type: toast.TYPE.WARNING
    })

    emailSending.value = false;

    return
  }

  contactService.sendEmail({
    first_name: state.firstName,
    last_name: state.lastName,
    email_address: state.emailAddress,
    subject: state.subject,
    message: state.message
  }).then((emailSent: boolean|null) => {
    if (emailSent) {
      state.firstName = ''
      state.lastName = ''
      state.emailAddress = ''
      state.subject = ''
      state.message = ''
      v$.value.$reset()
    }

    emailSending.value = false;
  })
}
</script>

<template>
  <main>
    <Title :title="$t('contact.title')" :level="1" />
    <Title :title="$t('contact.email.intro')" :level="2" :icon="false" :uppercase="false" :as-html="true"/>

    <form novalidate class="sm:w-[80%] xl:w-[60%] mx-auto mt-10" @submit.prevent.stop="submitEmail">
      <fieldset>
        <legend>{{ $t('contact.email.contact_details') }}</legend>

        <FormField :has-error="v$.firstName.$error" :error-message="reduceErrors(v$.firstName.$errors)">
          <input type="text" :placeholder="$t('contact.email.first_name')" name="contact-firstname" maxlength="255"
                 v-model.trim="state.firstName" />
        </FormField>

        <FormField :has-error="v$.lastName.$error" :error-message="reduceErrors(v$.lastName.$errors)">
          <input type="text" :placeholder="$t('contact.email.last_name')" name="contact-lastname" maxlength="255"
                 v-model.trim="state.lastName" />
        </FormField>

        <FormField :has-error="v$.emailAddress.$error" :error-message="reduceErrors(v$.emailAddress.$errors)">
          <input type="email" :placeholder="$t('contact.email.email_address')" name="contact-email" maxlength="255"
                 v-model.trim="state.emailAddress" />
        </FormField>
      </fieldset>
      <fieldset>
        <legend>{{ $t('contact.email.message') }}</legend>

        <FormField :has-error="v$.subject.$error" :error-message="reduceErrors(v$.subject.$errors)">
          <input type="text" :placeholder="$t('contact.email.subject')" name="contact-subject" maxlength="255"
                 v-model.trim="state.subject" />
        </FormField>

        <FormField :has-error="v$.message.$error" :error-message="reduceErrors(v$.message.$errors)" class="md:col-span-2">
          <textarea :placeholder="$t('contact.email.your_message')" name="contact-message" rows="5" maxlength="10000"
                    v-model.trim="state.message" />
        </FormField>
      </fieldset>

      <button type="submit" class="button-custom float-right mt-3" :disabled="emailSending ? true : undefined">
        <span class="custom-align">{{ $t('contact.email.send.label') }}</span>
        <FontAwesomeIcon v-if="!emailSending" :icon="faPaperPlane" class="custom-align ml-3" />
        <Loader v-else :loading="emailSending" class="custom-align ml-3 text-inherit"/>
      </button>
    </form>
  </main>
</template>

<style scoped>

</style>
