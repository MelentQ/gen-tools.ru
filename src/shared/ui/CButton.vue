<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  mod: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <button
    :disabled="props.disabled"
    class="sm:self-start py-2 px-3 min-w-[10rem] rounded border border-blue-600 bg-blue-600 text-white"
    :class="{ 'opacity-50': props.disabled, 'bg-red-500 border-red-500': props.mod === 'error' }"
    type="button"
  >
    <slot />
  </button>
</template>

<style scoped></style>
