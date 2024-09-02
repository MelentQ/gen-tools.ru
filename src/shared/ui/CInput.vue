<script setup>
import CTip from '@/shared/ui/CTip.vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  tip: {
    type: String,
    default: ''
  }
})

const model = defineModel({
  type: [String, Number],
  required: true
})
</script>

<template>
  <label class="block">
    <div class="flex items-center gap-2">
      <span class="text-gray-700" v-if="props.placeholder">{{ props.placeholder }}</span>
      <CTip v-if="props.tip" :text="props.tip" />
    </div>
    <input class="form-input block w-full mt-1 rounded" :type="type" v-model="model" />
  </label>
</template>

<style scoped></style>
