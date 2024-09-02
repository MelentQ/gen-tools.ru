<script setup>
import { ref } from 'vue'

const props = defineProps({
  closable: {
    type: Boolean,
    default: false
  }
})

const isOpened = ref(true)
</script>

<template>
  <div
    v-show="isOpened"
    class="relative flex gap-2 pl-3 py-2 bg-blue-100 rounded-lg"
    :class="{ 'pr-8': props.closable, 'pr-3': !props.closable }"
  >
    <button v-if="props.closable" class="absolute top-2 right-3" @click="isOpened = false">
      <font-awesome-icon icon="xmark" class="text-blue-600" />
    </button>
    <font-awesome-icon icon="circle-info" class="text-blue-600 mt-1" />
    <slot />
  </div>
</template>

<style scoped></style>
