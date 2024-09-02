<script setup>
import CTip from '@/shared/ui/CTip.vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  tip: {
    type: String,
    default: ''
  }
})

const model = defineModel({
  type: Boolean,
  required: true
})
</script>

<template>
  <div class="flex items-center gap-2">
    <label class="relative inline-flex items-center cursor-pointer">
      <input class="sr-only peer" type="checkbox" v-model="model" :disabled="props.disabled" />
      <span
        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
      ></span>
      <span class="ml-3 text-sm font-medium text-gray-900">{{ props.label }}</span>
    </label>
    <CTip :text="props.tip" />
  </div>
</template>

<style scoped></style>
