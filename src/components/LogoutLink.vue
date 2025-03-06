<script setup lang="ts">
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
import { useLoginService } from '@/services/admin/LoginService'

const userStore = useUserStore()
const router = useRouter()
const loginService = useLoginService()

async function logout() {
  await loginService.logout().then(r => r)

  userStore.setUserToken({
    access_token: null,
    access_token_expiration_date: null,
    refresh_token: null,
    refresh_token_expiration_date: null
  })

  await router.push({ name: 'admin.login' })
}
</script>

<template>
  <div v-if="userStore.isConnected()" class="inline relative md:bottom-0.5">
    <a href="/admin/logout" class="hover:text-primary hover:cursor-pointer transition-300"
       @click.prevent="logout">
      <FontAwesomeIcon :icon="faArrowRightFromBracket" class="inline-block align-middle" />
    </a>
  </div>
</template>

<style scoped>

</style>
