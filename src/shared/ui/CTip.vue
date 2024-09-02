<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button v-tippy="props.text" type="button">
    <font-awesome-icon icon="circle-info" class="text-gray-300 mt-1" />
  </button>
</template>

<style scoped></style>
