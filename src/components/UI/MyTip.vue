<template>
  <button v-if="text" v-tippy="text" type="button">
    <font-awesome-icon icon="circle-info" class="text-gray-300 mt-1" />
  </button>
</template>

<script>
export default {
  name: "MyTip",
  props: {
    text: String
  }
}
</script>

<style scoped>

</style>
