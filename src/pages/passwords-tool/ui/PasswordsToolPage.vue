<script setup>
import CMessage from '@/shared/ui/CMessage.vue'
import CToggle from '@/shared/ui/CToggle.vue'
import CInput from '@/shared/ui/CInput.vue'
import CCheckbox from '@/shared/ui/CCheckbox.vue'
import CTip from '@/shared/ui/CTip.vue'
import { Collapse } from 'vue-collapsed'
import CTextarea from '@/shared/ui/CTextarea.vue'
import CError from '@/shared/ui/CError.vue'
import CButton from '@/shared/ui/CButton.vue'
import CAccordion from '@/shared/ui/CAccordion.vue'
import CopyToClipboard from '@/shared/ui/CopyToClipboard.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { additionalSymbols, digits, en, specialCharacters } from '@/shared/utils/datasets'
import { timeCalculator } from '@/shared/utils/timeCalculator'
import { v1 as uuidv1 } from 'uuid'

const length = ref(12)
const count = ref(8)
const extended = ref(false)
const autoMode = ref(true)
const datasets = ref([
  {
    active: true,
    charset: digits.map((char, i) => ({ active: true, key: i, value: char })),
    key: 0,
    name: 'Цифры'
  },
  {
    active: true,
    charset: en.map((char, i) => ({ active: true, key: i, value: char })),
    key: 1,
    name: 'Строчные'
  },
  {
    active: true,
    charset: en.map((char, i) => ({ active: true, key: i, value: char.toUpperCase() })),
    key: 2,
    name: 'Прописные'
  },
  {
    active: true,
    charset: specialCharacters.map((char, i) => ({ active: true, key: i, value: char })),
    key: 3,
    name: 'Спец. символы'
  },
  {
    active: false,
    charset: additionalSymbols.map((char, i) => ({ active: true, key: i, value: char })),
    key: 4,
    name: 'Доп. символы'
  }
])

const once = ref(false)
const showTime = ref(false)
const showEntropy = ref(false)
const passwords = ref([])
const passwordsEl = ref(null)

const generate = () => {
  const generated = []

  for (let key = 0; key < count.value; key++) {
    const dataset = JSON.parse(JSON.stringify(filteredDatasets.value)) // Копирование массива
    let password = ''

    for (let i = 0; i < length.value; i++) {
      const randomCharsetIndex = Math.floor(Math.random() * dataset.length)
      const randomCharset = dataset[randomCharsetIndex]
      const randomCharIndex = Math.floor(Math.random() * randomCharset.length)
      const randomChar = randomCharset[randomCharIndex]

      if (once.value) {
        dataset[randomCharsetIndex].splice(randomCharIndex, 1)
        if (!dataset[randomCharsetIndex].length) {
          dataset.splice(randomCharsetIndex, 1)
        }
      }

      password += randomChar
    }

    generated.push({ key, value: password })
  }

  passwords.value = generated

  // Скролл по клику на кнопку "Сгенерировать"
  if (!autoMode.value) {
    const passwordsTopOffset = passwordsEl.value.getBoundingClientRect().top
    if (passwordsTopOffset < 0 || passwordsTopOffset + window.scrollY >= window.innerHeight) {
      passwordsEl.value.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const addDataset = () => {
  // 3 новых поля, которых не было в datasets
  datasets.value.push({
    active: true,
    charset: [], // setupCharset(dataset)
    key: uuidv1(),
    name: `Мой набор символов #${customDatasetsLength.value + 1}`,

    custom: true,
    isEdit: true,
    symbols: ''
  })
}

const setupCharset = (dataset) => {
  // Генерация поля charset для кастомных наборов символов
  datasets.value[datasets.value.findIndex((item) => item.key === dataset.key)].charset =
    dataset.symbols.split('').map((char, i) => ({
      active: true,
      key: i,
      value: char
    }))
}

const removeDataset = (key) => {
  datasets.value = datasets.value.filter((dataset) => dataset.key !== key)
}

const filteredDatasets = computed(() => {
  // Этот подготовленный массив нужен только для правильной рандомной генерации
  return datasets.value
    .filter((dataset) => dataset.active && dataset.charset.length)
    .map((dataset) => dataset.charset.filter((char) => char.active).map((char) => char.value))
    .filter((dataset) => dataset.length)
})

const symbols = computed(() => {
  return filteredDatasets.value.map((dataset) => dataset.join('')).join('')
})

const disabled = computed(() => {
  const errors = []

  // ???
  if (symbols.value.length === 0) {
    errors.push('Нет символов для генерации')
  }

  if (length.value <= 0) {
    errors.push('Длина пароля должна быть больше нуля')
  }

  if (count.value <= 0) {
    errors.push('Количество паролей должно быть больше нуля')
  }

  if (once.value && symbols.value.length < length.value) {
    errors.push(
      `Включена опция "Уникальные символы". Не хватает символов (${symbols.value.length}) для заданной длины пароля (${length.value})`
    )
  }

  return {
    status:
      symbols.value.length === 0 ||
      length.value <= 0 ||
      count.value <= 0 ||
      (once.value && symbols.value.length < length.value),
    errors
  }
})

const customDatasetsLength = computed(() => {
  return datasets.value.filter((dataset) => dataset.custom).length
})

const duplicates = computed(() => {
  const counts = {}
  const array = symbols.value.split('')
  array.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1
  })

  return Object.keys(counts)
    .filter((symbol) => counts[symbol] > 1)
    .map((symbol) => ({
      symbol,
      count: counts[symbol]
    }))
})

const entropy = computed(() => {
  const uniqueSymbolsLength =
    symbols.value.length - duplicates.value.reduce((acc, duplicate) => acc + duplicate.count - 1, 0)
  return Math.log2(Math.pow(uniqueSymbolsLength, length.value))
})

const time = computed(() => {
  const pps = 100000000000 // Passwords per second

  const guesses = Math.pow(2, entropy.value - 1)
  const times = timeCalculator(guesses / pps)
  const time = times.find((time) => time.value === '∞' || time.value > 0)

  // Здесь не знаю как лучше
  // Возвращаем либо объект, либо строку
  return time ?? 'мгновение'
})

watch([() => symbols.value, () => length.value], () => {
  if (autoMode.value && !disabled.value.status) {
    generate()
  }
})

onMounted(() => {
  if (autoMode.value) {
    generate()
  }
})
</script>

<template>
  <section class="py-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <CMessage>Все вычисления происходят на вашем устройстве</CMessage>
      </div>
      <CToggle
        v-model="extended"
        label="Расширенный интерфейс"
        tip="Редактирование и добавление собственных символов"
      />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-3 mt-3">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-3">
            <CInput v-model="length" type="number" placeholder="Длина пароля" />
            <ul class="flex flex-col gap-3">
              <template v-for="dataset in datasets" :key="dataset.key">
                <li v-if="extended || dataset.charset.length" class="flex flex-col gap-3">
                  <div class="flex items-center gap-2">
                    <CCheckbox
                      v-model="dataset.active"
                      :label="!dataset.isEdit || !extended ? dataset.name : ''"
                    />
                    <input
                      class="p-0 border-0 rounded text-gray-700"
                      v-if="extended && dataset.isEdit && dataset.custom"
                      v-model="dataset.name"
                      type="text"
                      required
                    />
                    <CTip
                      v-if="!dataset.isEdit || !extended"
                      :text="
                        dataset.charset
                          .filter((char) => char.active)
                          .map((char) => char.value)
                          .join('')
                      "
                    />
                    <button
                      v-if="dataset.custom && extended"
                      @click="dataset.isEdit = !dataset.isEdit"
                      type="button"
                      title="Редактировать"
                    >
                      <font-awesome-icon icon="pen-to-square" class="text-blue-600" />
                    </button>
                    <button
                      v-if="dataset.custom && dataset.isEdit && extended"
                      @click="removeDataset(dataset.key)"
                      type="button"
                      title="Удалить"
                    >
                      <font-awesome-icon icon="trash" class="text-red-500" />
                    </button>
                  </div>
                  <Collapse
                    v-if="dataset.custom && extended"
                    :when="dataset.custom && dataset.isEdit"
                  >
                    <div class="flex flex-col gap-2 grow p-3 bg-blue-100 rounded-lg">
                      <CTextarea
                        @input="setupCharset(dataset)"
                        v-model="dataset.symbols"
                        placeholder="Символы"
                      />
                    </div>
                  </Collapse>
                </li>
              </template>
            </ul>
            <button
              v-if="extended"
              @click="addDataset"
              class="self-start text-blue-600 border-b border-dashed border-current"
              type="button"
            >
              Добавить свои символы
            </button>
            <CTextarea
              v-if="extended"
              v-model="symbols"
              placeholder="Используемые символы"
              disabled
            />
            <CMessage v-if="duplicates.length" :can-close="true">
              <div>
                Найдены дубликаты символов:
                <ul class="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                  <template v-for="(duplicate, i) in duplicates" :key="i">
                    <li>
                      <b>{{ duplicate.symbol }}:</b>
                      {{ duplicate.count }}
                    </li>
                  </template>
                </ul>
              </div>
            </CMessage>
            <CMessage v-if="extended && showTime">
              Такой пароль может быть взломан примерно за
              <template v-if="typeof time === 'string'">
                {{ time.value }}
              </template>
              <template v-else>
                {{ time.value.toLocaleString('ru-RU') }}&nbsp;{{ time.name }}
              </template>
            </CMessage>
            <CMessage v-if="extended && showEntropy">
              Энтропия пароля {{ Math.round(entropy) }} бит
            </CMessage>
          </div>
          <CError v-for="(error, i) in disabled.errors" :key="i">
            {{ error }}
          </CError>
          <CButton @click="generate" :disabled="disabled.status">
            <font-awesome-icon v-if="autoMode" icon="bolt" />
            Сгенерировать
          </CButton>
          <CAccordion v-if="extended" title="Дополнительные опции">
            <div class="flex flex-col gap-3">
              <CInput v-model="count" type="number" placeholder="Количество паролей" />
              <CCheckbox
                v-model="once"
                label="Уникальные символы"
                tip="Каждый символ будет использоваться только один раз. Не исключает дублирования, если вы зададите свои символы"
              />
              <CCheckbox
                v-model="autoMode"
                label="Автоматически генерировать пароли"
                tip="Пароли будут генерироваться на любое изменение символьной базы"
              />
              <CCheckbox
                v-model="showTime"
                label="Показывать примерное время взлома пароля"
                tip="Рассчёт на основе того факта, что компьютерная система может перебирать 100 000 000 000 паролей в секунду"
              />
              <CCheckbox v-model="showEntropy" label="Показывать энтропию" />
              <template v-for="dataset in datasets" :key="dataset.key">
                <div v-if="dataset.charset.length">
                  <span class="text-gray-700">{{ dataset.name }}</span>
                  <ul class="flex flex-wrap gap-2 mt-1">
                    <li v-for="char in dataset.charset" :key="char.key">
                      <CCheckbox
                        v-model="char.active"
                        :disabled="!dataset.active"
                        :label="char.value"
                      />
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </CAccordion>
        </div>
        <div ref="passwordsEl" class="lg:col-span-2">
          <h3 class="text-gray-700">Созданные пароли</h3>
          <ul class="flex flex-col gap-3 mt-1">
            <li v-for="password in passwords" :key="password.key">
              <CopyToClipboard :text="password.value" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
