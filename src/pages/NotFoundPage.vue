<template>
  <section class="py-6">
    <div class="container mx-auto px-4">
      <h2 class="text-9xl">404</h2>
      <p class="text-xl">Страница не найдена.
        <router-link to="/" active-class="cursor-default no-underline" class="text-blue-600 underline">
          На главную
        </router-link>
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "NotFoundPage"
}
</script>

<style scoped>

</style>
