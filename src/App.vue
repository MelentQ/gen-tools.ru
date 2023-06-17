<template>
  <div class="flex flex-col min-h-screen">
    <header class="py-3 bg-blue-100">
      <div class="container mx-auto px-4">
        <ul class="flex items-center gap-3">
          <li>
            <router-link to="/" active-class="cursor-default no-underline" class="text-blue-600 underline">
              Генератор паролей
            </router-link>
          </li>
        </ul>
      </div>
    </header>
    <main class="flex-grow">
      <router-view/>
    </main>
    <footer>
      <div class="border-t border-blue-100 py-5">
        <div class="container mx-auto px-4">
          Предложить идею или написать отзыв можно <a class="underline text-blue-600" href="https://t.me/melentq"
                                                      target="_blank">здесь</a>.
        </div>
      </div>
      <div class="py-3 bg-blue-100">
        <div class="container mx-auto px-4">
          <a class="flex items-center gap-2 underline text-blue-600" href="https://github.com/MelentQ" target="_blank">
            <span>Автору 0 лет</span>
            <font-awesome-icon icon="arrow-up-right-from-square"/>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
