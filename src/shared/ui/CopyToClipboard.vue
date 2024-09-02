<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  }
})

const isCopied = ref(false)

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 1000)
  } catch (error) {
    console.warn('Не удалось скопировать: ', error.message)
  }
}
</script>

<template>
  <button
    @click="copy"
    class="flex items-center w-full py-2 px-3 border rounded border-gray-700 text-left"
    :class="{ 'bg-green-200': isCopied }"
    type="button"
  >
    <span class="flex-grow line-clamp-1" :title="props.text">{{ props.text }}</span>
    <font-awesome-icon v-if="isCopied" icon="check" class="text-green-600" />
    <font-awesome-icon v-else icon="copy" class="text-blue-600" />
  </button>
</template>

<style scoped></style>
