<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const model = defineModel({
  type: String,
  required: true
})
</script>

<template>
  <label class="block">
    <span v-if="props.placeholder" class="text-gray-700">{{ props.placeholder }}</span>
    <textarea
      class="form-input block w-full min-h-[6rem] max-h-40 mt-1 rounded"
      v-model="model"
      :disabled="props.disabled"
    ></textarea>
  </label>
</template>

<style scoped></style>
