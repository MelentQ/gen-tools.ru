<template>
  <button @click="copyToClipboard"
          class="flex items-center w-full py-2 px-3 border rounded border-gray-700 text-left"
          :class="{'bg-green-200': isCopied}"
          type="button">
    <span class="flex-grow line-clamp-1" :title="text">{{ text }}</span>
    <font-awesome-icon v-if="isCopied" icon="check" class="text-green-600"/>
    <font-awesome-icon v-else icon="copy" class="text-blue-600"/>
  </button>
</template>

<script>
export default {
  name: "CopyToClipboard",
  props: {
    text: String,
  },
  data() {
    return {
      isCopied: false
    }
  },
  methods: {
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.text);
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 1000);
      } catch (error) {
        console.warn('Не удалось скопировать: ', error.message)
      }
    },
  }
}
</script>

<style scoped>

</style>
