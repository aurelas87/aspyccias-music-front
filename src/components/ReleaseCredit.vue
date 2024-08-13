<script setup lang="ts">
import { type PropType, type UnwrapRef } from 'vue'
import ReleaseCredit from '@/models/Release/ReleaseCredit'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faUpRightFromSquare'

defineProps({
  creditType: {
    type: String,
    required: true
  },
  releaseCredits: {
    type: Object as PropType<UnwrapRef<ReleaseCredit[]>>,
    required: true
  }
})
</script>

<template>
  <p>
    <span class="font-bold">{{ $props.creditType }}{{ $t('colon') }}&nbsp;</span>
    <span v-for="(releaseCredit, index) in $props.releaseCredits">
      <a v-if="releaseCredit.link" :href="releaseCredit.link" target="_blank">
        {{ releaseCredit.fullName }}&nbsp;
        <FontAwesomeIcon :icon="faUpRightFromSquare"/>
      </a>

      <span v-else>{{ releaseCredit.fullName }}</span>
      <span v-if="index < $props.releaseCredits.length - 1">,&nbsp;</span>
    </span>
  </p>
</template>

<style scoped>

</style>
