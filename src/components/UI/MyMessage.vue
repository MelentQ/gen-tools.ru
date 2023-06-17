<template>
  <div v-show="isOpened" class="relative flex gap-2 pl-3 py-2 bg-blue-100 rounded-lg" :class="{'pr-8': canClose, 'pr-3': !canClose}">
    <button v-if="canClose" class="absolute top-2 right-3" @click="isOpened = false">
      <font-awesome-icon icon="xmark" class="text-blue-600" />
    </button>
    <font-awesome-icon icon="circle-info" class="text-blue-600 mt-1" />
    <slot/>
  </div>
</template>

<script>
export default {
  name: "MyMessage",
  props: {
    canClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpened: true
    }
  }
}
</script>

<style scoped>

</style>
