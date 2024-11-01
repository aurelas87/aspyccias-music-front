<script setup lang="ts">
import TitleIcon from '@/components/TitleIcon.vue'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  icon: {
    type: Boolean,
    required: false,
    default: true
  },
  uppercase: {
    type: Boolean,
    required: false,
    default: true
  },
  asHtml: {
    type: Boolean,
    required: false,
    default: false
  },
  margins: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  }
})

const classes = computed(() => {
  let classes = []

  if (props.class) {
    classes.push(props.class)
  }

  if (props.uppercase) {
    classes.push('uppercase')
  }

  if (props.margins) {
    classes.push(props.margins)
  } else {
    switch (props.level) {
      case 1: classes.push('mb-10')
        break
      case 2: classes.push('mb-3')
        break
      default:
    }
  }

  if (props.icon) {
    classes.push('leading-[83px]')
  }

  return (classes.length > 0) ? classes.join(' ') : null
})

const titleTagName = computed(() => {
  return `h${props.level}`
})
</script>

<template>
  <component :is="titleTagName" :class="classes">
    <TitleIcon v-if="$props.icon" />

    <span v-if="$props.level === 1" class="text-primary">{{ $props.title.slice(0, 1) }}</span>
    <span v-if="$props.level === 1">{{ $props.title.slice(1) }}</span>

    <span v-if="$props.level > 1 && !$props.asHtml">{{ $props.title }}</span>
    <span v-if="$props.level > 1 && $props.asHtml" v-html="$props.title"></span>
  </component>
</template>

<style lang="postcss" scoped>

</style>
