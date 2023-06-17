<template>
  <div class="flex flex-col gap-3">
    <button @click="handleCollapse" class="flex items-center gap-2 self-start text-left text-blue-600"
            type="button">
      <span class="border-b border-dashed border-current">{{ title }}</span>
      <font-awesome-icon icon="plus" class="transition-transform" :class="{'rotate-45': isExpanded}"/>
    </button>
    <Collapse :when="isExpanded">
      <slot/>
    </Collapse>
  </div>
</template>

<script>

import {Collapse} from "vue-collapsed";

export default {
  name: "MyAccordion",
  components: {Collapse},
  props: {
    title: String
  },
  data() {
    return {
      isExpanded: false
    }
  },
  methods: {
    handleCollapse() {
      this.isExpanded = !this.isExpanded;
    }
  }
}
</script>

<style scoped>

</style>
