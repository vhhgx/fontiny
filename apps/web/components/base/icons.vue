<template>
  <i
    class="iconsax mr-2"
    :class="`vuesax-${style}-${icon}`"
    :style="{ fontSize: `${size}px`, color: color }"></i>
</template>

<script setup>
const props = defineProps({
  icon: String,
  style: {
    type: String,
    default: 'linear',
  },
  color: String,
  size: {
    type: String,
    default: '16',
  },
})
</script>

<style></style>
