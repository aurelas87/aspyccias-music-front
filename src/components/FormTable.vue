<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { type PropType } from 'vue'
import { useEmitter } from '@/plugins/emitter'
import { type CustomLinks, DirectionEnum, type TableHeaders } from '@/types/admin/Commons'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

library.add(fas)

const emitter = useEmitter()
const i18n = useI18n()

const props = defineProps({
  headers: {
    type: Array as PropType<TableHeaders>,
    required: true
  },
  items: {
    type: Array<any>,
    required: true
  },
  itemType: {
    type: String,
    required: true
  },
  previousOffset: {
    type: Number as PropType<number | null>,
    required: false,
    default: null
  },
  nextOffset: {
    type: Number as PropType<number | null>,
    required: false,
    default: null
  },
  moveFunction: {
    type: Function,
    required: false
  },
  addRouteName: {
    type: String,
    required: true
  },
  viewRouteName: {
    type: String,
    required: false
  },
  editRouteName: {
    type: String,
    required: true
  },
  deleteFunction: {
    type: Function,
    required: true
  },
  customLinks: {
    type: Array as PropType<CustomLinks>,
    required: false,
    default: []
  },
  itemIdentifier: {
    type: String,
    required: true
  }
})

function isFirstIndex(index: number) {
  return index === 0
}

function isLastIndex(index: number) {
  return index === props.items.length - 1
}

function updateSuccess(updateResponse: boolean | null) {
  if (updateResponse === true) {
    emitter.emit('listUpdated')
  }
}

function deleteItem(identifier: string) {
  const confirmed = window.confirm('Are you sure you want to delete the item "' + identifier + '"?')
  if (!confirmed) {
    return
  }

  props.deleteFunction(identifier)
    .then(updateSuccess)
}

function moveItem(identifier: string, direction: DirectionEnum) {
  if (!props.moveFunction) {
    toast('Unable to move item', {
      type: toast.TYPE.ERROR
    })
    return
  }

  props.moveFunction(identifier, direction)
    .then(updateSuccess)
}

function loadNext() {
  emitter.emit('listNext')
}

function loadPrevious() {
  emitter.emit('listPrevious')
}

function formatItemData(value: any): any {
  return value instanceof Date ? i18n.d(value) : value
}
</script>

<template>
  <transition appear>
    <div>
      <p class="text-right">
        <RouterLink :to="{ name: $props.addRouteName }" class="button-custom button-add">
          <span>Add a {{ $props.itemType }}</span>
          <FontAwesomeIcon :icon="['fas', 'plus']" class="ml-3" />
        </RouterLink>
      </p>

      <table class="w-full">
        <thead>
        <tr>
          <th v-for="header in $props.headers">{{ header.name }}</th>
          <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="items.length > 0" v-for="(item, index) in $props.items">
          <td v-for="header in $props.headers">{{ formatItemData(item[header.property]) }}</td>

          <td>
            <span v-if="$props.moveFunction"
                  class="hover:text-primary transition-300 inline-block w-5 h-4"
                  :class="{'cursor-pointer': !isFirstIndex(index)}"
                  @click="moveItem(item[$props.itemIdentifier], DirectionEnum.Up)">
              <FontAwesomeIcon v-if="!isFirstIndex(index)" :icon="['fas', 'up-long']"></FontAwesomeIcon>
            </span>

            <span v-if="$props.moveFunction"
                  class="hover:text-primary transition-300 inline-block w-5 h-4"
                  :class="{'cursor-pointer': !isLastIndex(index)}"
                  @click="moveItem(item[$props.itemIdentifier], DirectionEnum.Down)">
              <FontAwesomeIcon v-if="!isLastIndex(index)" :icon="['fas', 'down-long']"></FontAwesomeIcon>
            </span>

            <RouterLink
              v-if="$props.viewRouteName && $props.itemIdentifier"
              :to="{ name: $props.viewRouteName, params: { [$props.itemIdentifier]: item[$props.itemIdentifier] } }"
              target="_blank"
              class="button-custom text-success ml-1">
              <span>View</span>
              <FontAwesomeIcon :icon="['fas', 'eye']" class="ml-3" />
            </RouterLink>

            <RouterLink
              :to="{ name: $props.editRouteName, params: { [$props.itemIdentifier]: item[$props.itemIdentifier] } }"
              class="button-custom button-edit ml-1">
              <span>Edit</span>
              <FontAwesomeIcon :icon="['fas', 'pen']" class="ml-3" />
            </RouterLink>

            <RouterLink
              v-for="(customLink) in $props.customLinks"
              :to="{ name: customLink.name, params: { [$props.itemIdentifier]: item[$props.itemIdentifier] } }"
              class="button-custom button-edit ml-1">
              <span>{{ customLink.label }}</span>
              <FontAwesomeIcon :icon="['fas', customLink.icon]" class="ml-3" />
            </RouterLink>

            <button class="button-custom button-delete ml-1" @click="deleteItem(item[$props.itemIdentifier])">
              <span>Delete</span>
              <FontAwesomeIcon :icon="['fas', 'trash']" class="ml-3" />
            </button>
          </td>
        </tr>

        <tr v-else>
          <td :colspan="headers.length + 1">List is empty</td>
        </tr>
        </tbody>
      </table>

      <div class="flex justify-center mt-5">
        <div class="basis-1/2">
          <button v-if="$props.previousOffset !== null"
                  class="button-custom"
                  @click="loadPrevious">
            <FontAwesomeIcon :icon="['fas', 'chevron-left']" class="mr-3" />
            <span>Previous</span>
          </button>
        </div>

        <div class="basis-1/2">
          <button v-if="$props.nextOffset !== null"
                  class="button-custom"
                  @click="loadNext">
            <span>Next</span>
            <FontAwesomeIcon :icon="['fas', 'chevron-right']" class="ml-3" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>

</style>
