<template>
  <div class="flex items-center gap-2">
    <label class="flex items-center gap-2 self-start" :class="{'opacity-50': disabled, 'cursor-pointer': !disabled}">
      <input class="form-checkbox rounded" type="checkbox" :checked="modelValue" :disabled="disabled" @change="onChange">
      <span v-if="placeholder" class="text-gray-700 select-none">{{ placeholder }}</span>
    </label>
    <my-tip :text="tip"/>
  </div>
</template>

<script>
import MyTip from "@/components/UI/MyTip.vue";

export default {
  name: "MyCheckbox",
  components: {MyTip},
  props: {
    placeholder: String,
    modelValue: Boolean,
    disabled: Boolean,
    tip: String
  },
  methods: {
    onChange(e) {
      this.$emit('update:modelValue', e.target.checked)
    }
  }
}
</script>

<style scoped>

</style>
