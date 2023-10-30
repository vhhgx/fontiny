<template>
  <div class="flex flex-col">
    <div make="标题" class="my-6">
      <span class="text-2xl font-black">{{ title }}</span>
      <slot name="options"></slot>
    </div>
    <div class="flex flex-col p-6 bg-white rounded-xl">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String
})
</script>

<style></style>