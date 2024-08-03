<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons/faCompactDisc'

defineProps({
  loading: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <FontAwesomeIcon v-if="$props.loading" :icon="faCompactDisc" class="animate-spin text-5xl" />
</template>

<style scoped>

</style>
