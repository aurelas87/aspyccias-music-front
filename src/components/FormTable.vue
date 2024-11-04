<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDownLong, faPen, faPlus, faTrash, faUpLong } from '@fortawesome/free-solid-svg-icons'
import { type PropType, ref } from 'vue'
import { useEmitter } from '@/plugins/emitter'
import { DirectionEnum, type TableHeaders } from '@/types/admin/Commons'
import { toast } from 'vue3-toastify'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { useI18n } from 'vue-i18n'

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
  editable: {
    type: Boolean,
    required: false,
    default: true
  },
  deletable: {
    type: Boolean,
    required: false,
    default: true
  },
  addRouteName: {
    type: String,
    required: true
  },
  editRouteName: {
    type: String,
    required: true
  },
  editRouteParamName: {
    type: String,
    required: true
  },
  deleteFunction: {
    type: Function,
    required: true
  }
})

function isFirstIndex(index: number) {
  return index === 0
}

function isLastIndex(index: number) {
  return index === props.items.length - 1
}

const updating = ref(false)

function updateSuccess(updateResponse: boolean | null) {
  if (updateResponse === true) {
    emitter.emit('listUpdated')
  }

  updating.value = false
}

function deleteItem(identifier: string) {
  updating.value = true

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

  updating.value = true

  props.moveFunction(identifier, direction)
    .then(updateSuccess)
}

function loadNext() {
  emitter.emit('listNext')
}

function loadPrevious() {
  emitter.emit('listPrevious')
}

function formatItemData (value: any): any {
  return value instanceof Date ? i18n.d(value) : value
}
</script>

<template>
  <transition appear>
    <div>
      <p class="text-right">
        <RouterLink :to="{ name: $props.addRouteName }" class="button-custom button-add">
          <span>Add a {{ $props.itemType }}</span>
          <FontAwesomeIcon :icon="faPlus" class="ml-3" />
        </RouterLink>
      </p>

      <table class="w-full">
        <thead>
        <tr>
          <th v-for="header in $props.headers">{{ header.name }}</th>
          <th v-if="$props.editable || $props.deletable">Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="items.length > 0" v-for="(item, index) in $props.items">
          <td v-for="header in $props.headers">{{ formatItemData(item[header.property]) }}</td>

          <td>
            <span v-if="$props.moveFunction"
                  class="hover:text-primary transition-300 inline-block w-5 h-4"
                  :class="{'cursor-pointer': !isFirstIndex(index)}"
                  @click="moveItem(item.name, DirectionEnum.Up)">
              <FontAwesomeIcon v-if="!isFirstIndex(index)" :icon="faUpLong"></FontAwesomeIcon>
            </span>

            <span v-if="$props.moveFunction"
                  class="hover:text-primary transition-300 inline-block w-5 h-4"
                  :class="{'cursor-pointer': !isLastIndex(index)}"
                  @click="moveItem(item.name, DirectionEnum.Down)">
              <FontAwesomeIcon v-if="!isLastIndex(index)" :icon="faDownLong"></FontAwesomeIcon>
            </span>

            <RouterLink
              :to="{ name: $props.editRouteName, params: { [$props.editRouteParamName]: item[$props.editRouteParamName] } }"
              class="button-custom button-edit ml-1">
              <span>Edit</span>
              <FontAwesomeIcon :icon="faPen" class="ml-3" />
            </RouterLink>

            <button class="button-custom button-delete ml-1" @click="deleteItem(item.name)">
              <span>Delete</span>
              <FontAwesomeIcon :icon="faTrash" class="ml-3" />
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
            <FontAwesomeIcon :icon="faChevronLeft" class="mr-3" />
            <span>Previous</span>
          </button>
        </div>

        <div class="basis-1/2">
          <button v-if="$props.nextOffset !== null"
                  class="button-custom"
                  @click="loadNext">
            <span>Next</span>
            <FontAwesomeIcon :icon="faChevronRight" class="ml-3" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>

</style>
