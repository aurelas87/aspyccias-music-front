<script setup lang="ts">

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faQuestion)
</script>

<template>
  <main class="text-2xl">
    <div class="flex items-end my-5 mx-auto">
      <FontAwesomeIcon :icon="['fas', 'question']" class="text-8xl -rotate-12" />
      <FontAwesomeIcon :icon="['fas', 'question']" class="text-9xl" />
      <FontAwesomeIcon :icon="['fas', 'question']" class="text-6xl rotate-45" />
    </div>

    <p class="text-4xl my-5">{{ $t('page.lost') }}</p>

    <p>{{ $t('page.not_found.line1') }}</p>
    <p>{{ $t('page.not_found.line2') }}</p>
    <p>{{ $t('page.not_found.line3') }}</p>
  </main>
</template>

<style scoped>

</style>
