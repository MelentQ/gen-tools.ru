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
    <label
      class="flex items-center gap-2 self-start"
      :class="{ 'opacity-50': disabled, 'cursor-pointer': !disabled }"
    >
      <input class="form-checkbox rounded" type="checkbox" v-model="model" :disabled="disabled" />
      <span v-if="props.label" class="text-gray-700 select-none">{{ props.label }}</span>
    </label>
    <CTip v-if="props.tip" :text="props.tip" />
  </div>
</template>

<style scoped></style>
