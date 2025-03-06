<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWarning } from '@fortawesome/free-solid-svg-icons/faWarning'

defineProps({
  hasError: {
    type: Boolean,
    required: false
  },
  errorMessage: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="form-field text-left" :class="{ error: $props.hasError }">
    <slot></slot>

    <p v-if="$props.hasError && $props.errorMessage"
       class="error-message">
      <FontAwesomeIcon :icon="faWarning" />
      <span>{{ $t($props.errorMessage) }}</span>
    </p>
  </div>
</template>

<style scoped>

</style>
