<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { customRequired, reduceErrors } from '@/composables/validation'
import useVuelidate from '@vuelidate/core'
import FormField from '@/components/FormField.vue'
import Loader from '@/components/Loader.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'vue3-toastify'
import { useLoginService } from '@/services/admin/LoginService'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const state = reactive({
  username: '',
  password: ''
})

const loginInProgress = ref(false)

const disabled = computed(() => {
  return loginInProgress.value ? true : undefined
})

const rules = {
  username: { customRequired },
  password: { customRequired }
}

const v$ = useVuelidate(rules, state)

const loginService = useLoginService()
const router = useRouter()
const userStore = useUserStore()

async function submitLogin() {
  loginInProgress.value = true


  v$.value.$reset()
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    toast('Invalid data', {
      type: toast.TYPE.WARNING
    })

    loginInProgress.value = false;

    return
  }

  loginService.login({
    username: state.username,
    password: state.password,
  }).then((loginResponse: LoginResponse|null) => {
    if (loginResponse) {
      state.username = ''
      state.password = ''
      v$.value.$reset()

      userStore.setUserToken(loginResponse.token)

      router.push({ name: 'admin.profile' })
    }

    loginInProgress.value = false;
  })
}
</script>

<template>
  <main>
    <form novalidate class="mx-auto mt-10" @submit.prevent.stop="submitLogin">
      <FormField :has-error="v$.username.$error" :error-message="reduceErrors(v$.username.$errors)">
        <input type="text" placeholder="username" name="username" maxlength="255"
               v-model.trim="state.username" :disabled="disabled" />
      </FormField>

      <FormField :has-error="v$.password.$error" :error-message="reduceErrors(v$.password.$errors)">
        <input type="password" placeholder="Password" name="password" maxlength="255"
               v-model.trim="state.password" :disabled="disabled" />
      </FormField>

      <button type="submit" class="button-custom mt-3" :disabled="loginInProgress ? true : undefined">
        <span class="custom-align">Login</span>
        <FontAwesomeIcon v-if="!loginInProgress" :icon="faArrowRightToBracket" class="custom-align ml-3" />
        <Loader v-else :loading="loginInProgress" class="custom-align ml-3 text-inherit"/>
      </button>
    </form>
  </main>
</template>

<style scoped>

</style>
