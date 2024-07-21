<script setup lang="ts">
import type { RouteRecordNormalized } from 'vue-router'

const props = defineProps<{
  route: RouteRecordNormalized,
  class?: String,
  click?: CallableFunction
}>()
</script>

<template>
  <RouterLink v-if="props.route.name && props.route.name !== 'not-found'"
              :to="props.route.path"
              class="hover:text-primary transition-300"
              :class="props.class || ''"
              @click="props.click">
    {{ $t(props.route.name.toString()) }}
  </RouterLink>
</template>

<style scoped>

</style>
