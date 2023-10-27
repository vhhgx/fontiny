<template>
  <div class="rounded-xl bg-cyan-100 px-4 py-1 text-sm text-cyan-900 mx-2 flex items-center">
    <BaseIcons :icon="icon"></BaseIcons>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: String
})
</script>

<style></style>