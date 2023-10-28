<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <div class="font-bold mr-2">{{ fontName }}</div>
      <div v-for="item in icons">
        <BaseTags :icon="item.icon || `text`">{{ item.text }}</BaseTags>
      </div>
    </div>
    <div class="mt-6" :style="{ 'font-size': `${fontSize}px`, 'font-family': `${fontFamily}` }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  fontName: String,
  fontSize: Number,
  fontFamily: String,
  icons: Array
})
</script>

<style></style>