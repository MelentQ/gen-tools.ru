<template>
  <label class="block">
    <span v-if="placeholder" class="text-gray-700">{{ placeholder }}</span>
    <textarea class="form-input block w-full min-h-[6rem] max-h-40 mt-1 rounded" :value="modelValue" :disabled="disabled" @input="onInput"></textarea>
  </label>
</template>

<script>
export default {
  name: "MyTextarea",
  props: {
    disabled: Boolean,
    placeholder: String,
    modelValue: [String, Number],
  },
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', e.target.value);
      this.$emit('input');
    }
  }
}
</script>

<style scoped>

</style>
