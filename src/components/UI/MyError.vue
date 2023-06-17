<template>
  <div class="flex gap-2 px-3 py-2 bg-red-100 rounded-lg">
    <font-awesome-icon icon="circle-info" class="text-red-600 mt-1" />
    <slot/>
  </div>
</template>

<script>
export default {
  name: "MyError"
}
</script>

<style scoped>

</style>
