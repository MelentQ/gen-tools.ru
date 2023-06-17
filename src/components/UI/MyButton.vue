<template>
  <button :disabled="disabled"
          class="sm:self-start py-2 px-3 min-w-[10rem] rounded border border-blue-600 bg-blue-600 text-white"
          :class="{'opacity-50': disabled, 'bg-red-500 border-red-500': mod === 'error'}"
          type="button">
    <slot/>
  </button>
</template>

<script>
export default {
  name: "MyButton",
  props: {
    disabled: Boolean,
    mod: String
  }
}
</script>

<style scoped>

</style>
