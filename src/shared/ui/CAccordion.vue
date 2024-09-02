<script setup>
import { Collapse } from 'vue-collapsed'
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const isExpanded = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      @click="isExpanded = !isExpanded"
      class="flex items-center gap-2 self-start text-left text-blue-600"
      type="button"
    >
      <span class="border-b border-dashed border-current">{{ props.title }}</span>
      <font-awesome-icon
        icon="plus"
        class="transition-transform"
        :class="{ 'rotate-45': isExpanded }"
      />
    </button>
    <Collapse :when="isExpanded">
      <slot />
    </Collapse>
  </div>
</template>

<style scoped></style>
