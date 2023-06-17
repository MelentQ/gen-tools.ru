<template>
  <label class="block">
    <div class="flex items-center gap-2">
      <span class="text-gray-700">{{ placeholder }}</span>
      <my-tip :text="tip"/>
    </div>
    <input class="form-input block w-full mt-1 rounded" :type="type" :value="modelValue" @input="onInput">
  </label>
</template>

<script>
import MyTip from "@/components/UI/MyTip.vue";

export default {
  name: "MyInput",
  components: {MyTip},
  props: {
    type: String,
    placeholder: String,
    modelValue: [String, Number],
    tip: String
  },
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', e.target.value)
    }
  }
}
</script>

<style scoped>

</style>
