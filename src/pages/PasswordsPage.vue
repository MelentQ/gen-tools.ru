<template>
  <section class="py-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <my-message>Все вычисления происходят на вашем устройстве</my-message>
      </div>
      <my-toggle v-model="extended" placeholder="Расширенный интерфейс"
                 tip="Редактирование и добавление собственных символов"/>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-3 mt-3">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3">
            <my-input v-model="length" type="number" placeholder="Длина пароля"/>
            <ul class="flex flex-col gap-3">
              <template v-for="dataset in datasets" :key="dataset.key">
                <li v-if="extended || dataset.charset.length" class="flex flex-col gap-3">
                  <div class="flex items-center gap-2">
                    <my-checkbox v-model="dataset.active"
                                 :placeholder="!dataset.isEdit || !extended ? dataset.name : ''"/>
                    <input class="p-0 border-0 rounded text-gray-700"
                           v-if="extended && dataset.isEdit && dataset.custom"
                           v-model="dataset.name" type="text" required>
                    <my-tip v-if="!dataset.isEdit || !extended"
                            :text="dataset.charset.filter(char => char.active).map(char => char.value).join('')"/>
                    <button v-if="dataset.custom && extended" @click="dataset.isEdit = !dataset.isEdit" type="button"
                            title="Редактировать">
                      <font-awesome-icon icon="pen-to-square" class="text-blue-600"/>
                    </button>
                    <button v-if="dataset.custom && dataset.isEdit && extended" @click="removeDataset(dataset.key)"
                            type="button"
                            title="Удалить">
                      <font-awesome-icon icon="trash" class="text-red-500"/>
                    </button>
                  </div>
                  <Collapse v-if="dataset.custom && extended" :when="dataset.custom && dataset.isEdit">
                    <div class="flex flex-col gap-2 grow p-3 bg-blue-100 rounded-lg">
                      <my-textarea @input="setupCharset(dataset)" v-model="dataset.symbols" placeholder="Символы"/>
                    </div>
                  </Collapse>
                </li>
              </template>
            </ul>
            <button v-if="extended" @click="addDataset"
                    class="self-start text-blue-600 border-b border-dashed border-current"
                    type="button">
              Добавить свои символы
            </button>
            <my-textarea v-if="extended" v-model="symbols" placeholder="Используемые символы" disabled/>
            <my-message v-if="duplicates.length" :can-close="true">
              <div>
                Найдены дубликаты символов:
                <ul class="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                  <template v-for="(duplicate, i) in duplicates" :key="i">
                    <li><b>{{ duplicate.symbol }}:</b> {{ duplicate.count }}</li>
                  </template>
                </ul>
              </div>
            </my-message>
            <my-message v-if="extended && showTime">
              Такой пароль может быть взломан примерно за
              <template v-if="typeof time === 'string'">
                {{ time }}
              </template>
              <template v-else>
                {{ time.value.toLocaleString('ru-RU') }}&nbsp;{{ time.name }}
              </template>
            </my-message>
            <my-message v-if="extended && showEntropy">
              Энтропия пароля {{ Math.round(entropy) }} бит
            </my-message>
          </div>
          <my-error v-for="(error, i) in disabled.errors" :key="i">
            {{ error }}
          </my-error>
          <my-button @click="generate" :disabled="disabled.status">
            <font-awesome-icon v-if="autoMode" icon="bolt"/>
            Сгенерировать
          </my-button>
          <my-accordion v-if="extended" title="Дополнительные опции">
            <div class="flex flex-col gap-3">
              <my-input v-model="count" type="number" placeholder="Количество паролей"/>
              <my-checkbox v-model="once" placeholder="Уникальные символы"
                           tip="Каждый символ будет использоваться только один раз. Не исключает дублирования, если вы зададите свои символы"/>
              <my-checkbox v-model="autoMode" placeholder="Автоматически генерировать пароли"
                           tip="Пароли будут генерироваться на любое изменение символьной базы"/>
              <my-checkbox v-model="showTime" placeholder="Показывать примерное время взлома пароля"
                           tip="Рассчёт на основе того факта, что компьютерная система может перебирать 100 000 000 000 паролей в секунду"/>
              <my-checkbox v-model="showEntropy" placeholder="Показывать энтропию"/>
              <template v-for="dataset in datasets" :key="dataset.key">
                <div v-if="dataset.charset.length">
                  <span class="text-gray-700">{{ dataset.name }}</span>
                  <ul class="flex flex-wrap gap-2 mt-1">
                    <li v-for="char in dataset.charset" :key="char.key">
                      <my-checkbox v-model="char.active" :disabled="!dataset.active" :placeholder="char.value"/>
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </my-accordion>
        </div>
        <div ref="passwords" class="lg:col-span-2">
          <h3 class="text-gray-700">Созданные пароли</h3>
          <ul class="flex flex-col gap-3 mt-1">
            <li v-for="password in passwords" :key="password.key">
              <copy-to-clipboard :text="password.value"/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {v1 as uuidv1} from 'uuid';

import MyInput from "@/components/UI/MyInput.vue";
import {additionalSymbols, digits, en, symbols} from "@/utils/datasets";
import MyTextarea from "@/components/UI/MyTextarea.vue";
import MyCheckbox from "@/components/UI/MyCheckbox.vue";
import MyButton from "@/components/UI/MyButton.vue";
import CopyToClipboard from "@/components/CopyToClipboard.vue";
import MyAccordion from "@/components/MyAccordion.vue";
import MyMessage from "@/components/UI/MyMessage.vue";
import {Collapse} from "vue-collapsed";
import {timeCalculator} from "@/utils/timeCalculator";
import MyToggle from "@/components/UI/MyToggle.vue";
import MyError from "@/components/UI/MyError.vue";
import MyTip from "@/components/UI/MyTip.vue";

export default {
  name: "PasswordsPage",
  components: {
    MyTip,
    MyError,
    MyToggle,
    Collapse,
    MyMessage,
    MyAccordion,
    CopyToClipboard,
    MyButton,
    MyCheckbox,
    MyTextarea,
    MyInput
  },
  data() {
    return {
      length: 12,
      count: 8,
      extended: false,
      autoMode: true,
      datasets: [
        {
          active: true,
          charset: digits.map((char, i) => ({active: true, key: i, value: char})),
          key: 0,
          name: 'Цифры'
        },
        {
          active: true,
          charset: en.map((char, i) => ({active: true, key: i, value: char})),
          key: 1,
          name: 'Строчные'
        },
        {
          active: true,
          charset: en.map((char, i) => ({active: true, key: i, value: char.toUpperCase()})),
          key: 2,
          name: 'Прописные'
        },
        {
          active: true,
          charset: symbols.map((char, i) => ({active: true, key: i, value: char})),
          key: 3,
          name: 'Спец. символы'
        },
        {
          active: false,
          charset: additionalSymbols.map((char, i) => ({active: true, key: i, value: char})),
          key: 4,
          name: 'Доп. символы'
        },
      ],
      once: false,
      unique: false,
      showTime: false,
      showEntropy: false,
      passwords: []
    }
  },
  methods: {
    generate() {
      const passwords = [];

      for (let key = 0; key < this.count; key++) {
        const dataset = JSON.parse(JSON.stringify(this.filteredDatasets)); // Копирование массива
        let password = '';

        for (let i = 0; i < this.length; i++) {
          const randomCharsetIndex = Math.floor(Math.random() * dataset.length);
          const randomCharset = dataset[randomCharsetIndex];
          const randomCharIndex = Math.floor(Math.random() * randomCharset.length);
          const randomChar = randomCharset[randomCharIndex];

          if (this.once) {
            dataset[randomCharsetIndex].splice(randomCharIndex, 1);
            if (!dataset[randomCharsetIndex].length) {
              dataset.splice(randomCharsetIndex, 1);
            }
          }

          password += randomChar;
        }

        passwords.push({key, value: password});
      }

      this.passwords = passwords;

      // Скролл по клику на кнопку "Сгенерировать"
      if (!this.autoMode) {
        const passwordsTopOffset = this.$refs.passwords.getBoundingClientRect().top;
        if (passwordsTopOffset < 0 || passwordsTopOffset + window.scrollY >= window.innerHeight) {
          this.$refs.passwords.scrollIntoView({behavior: 'smooth'});
        }
      }
    },
    addDataset() {
      // 3 новых поля, которых не было в this.datasets
      this.datasets.push({
        active: true,
        charset: [], // setupCharset(dataset)
        key: uuidv1(),
        name: `Мой набор символов #${this.customDatasetsLength + 1}`,

        custom: true,
        isEdit: true,
        symbols: ''
      })
    },
    setupCharset(dataset) {
      // Генерация поля charset для кастомных наборов символов
      this.datasets[this.datasets.findIndex(item => item.key === dataset.key)].charset = dataset.symbols.split('').map((char, i) => ({
        active: true,
        key: i,
        value: char
      }));
    },
    removeDataset(key) {
      this.datasets = this.datasets.filter(dataset => dataset.key !== key)
    }
  },
  computed: {
    filteredDatasets() {
      // Этот подготовленный массив нужен только для правильной рандомной генерации
      return this.datasets.filter(dataset => dataset.active && dataset.charset.length).map(dataset => dataset.charset.filter(char => char.active).map(char => char.value)).filter(dataset => dataset.length);
    },
    symbols() {
      return this.filteredDatasets.map(dataset => dataset.join('')).join('');
    },
    disabled() {
      const errors = [];

      // ???
      if (this.symbols.length === 0) {
        errors.push('Нет символов для генерации');
      }

      if (this.length <= 0) {
        errors.push('Длина пароля должна быть больше нуля');
      }

      if (this.count <= 0) {
        errors.push('Количество паролей должно быть больше нуля');
      }

      if (this.once && this.symbols.length < this.length) {
        errors.push(`Включена опция "Уникальные символы". Не хватает символов (${this.symbols.length}) для заданной длины пароля (${this.length})`);
      }

      return {
        status: this.symbols.length === 0 || this.length <= 0 || this.count <= 0 || this.once && this.symbols.length < this.length,
        errors
      };
    },
    customDatasetsLength() {
      return this.datasets.filter(dataset => dataset.custom).length;
    },
    duplicates() {
      const counts = {};
      const array = this.symbols.split('');
      array.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });

      return Object.keys(counts).filter(symbol => counts[symbol] > 1).map(symbol => ({
        symbol,
        count: counts[symbol]
      }));
    },
    entropy() {
      const uniqueSymbolsLength = this.symbols.length - this.duplicates.reduce((acc, duplicate) => acc + duplicate.count - 1, 0);
      return Math.log2(Math.pow(uniqueSymbolsLength, this.length));
    },
    time() {
      const pps = 100000000000; // Passwords per second

      const guesses = Math.pow(2, this.entropy - 1);
      const times = timeCalculator(guesses / pps);
      const time = times.find(time => time.value === "∞" || time.value > 0);

      // Здесь не знаю как лучше
      // Возвращаем либо объект, либо строку
      return time ?? 'мгновение';
    }
  },
  watch: {
    symbols() {
      if (this.autoMode && !this.disabled.status) {
        this.generate();
      }
    },
    length() {
      if (this.autoMode && !this.disabled.status) {
        this.generate();
      }
    }
  },
  mounted() {
    if (this.autoMode) {
      this.generate();
    }
  }
}
</script>

<style scoped>

</style>
