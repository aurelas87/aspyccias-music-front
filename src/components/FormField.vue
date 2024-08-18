<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWarning } from '@fortawesome/free-solid-svg-icons/faWarning'
import { ref } from 'vue'

defineProps({
  hasError: {
    type: Boolean,
    required: true
  },
  errorMessage: {
    type: String,
    required: true
  }
})

const errorMessageVisible = ref(false)
</script>

<template>
  <div class="form-field text-left" :class="{ error: $props.hasError }">
    <slot></slot>

    <p v-if="$props.hasError" class="px-3 py-1 m-0 rounded-b-custom bg-dark-grey text-error flex flex-row gap-3 items-center">
      <FontAwesomeIcon :icon="faWarning"
                       @mouseover="errorMessageVisible = true"
                       @mouseleave="errorMessageVisible = false" />
      <span>{{ $t($props.errorMessage) }}</span>
    </p>
  </div>
</template>

<style scoped>

</style>
