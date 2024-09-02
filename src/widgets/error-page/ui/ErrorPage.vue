<script setup>
const props = defineProps({
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section class="py-6">
    <div class="container mx-auto px-4">
      <h2 class="text-9xl">{{ props.code }}</h2>
      <p class="text-xl">
        {{ props.description }}
        <router-link
          to="/"
          active-class="cursor-default no-underline"
          class="text-blue-600 underline"
        >
          На главную
        </router-link>
      </p>
    </div>
  </section>
</template>

<style scoped></style>
