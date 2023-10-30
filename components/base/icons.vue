<template>
  <i class="iconsax mr-2" :class="`vuesax-${style}-${icon} ${color}`"></i>
</template>

<script setup>
const props = defineProps({
  icon: String,
  style: {
    type: String,
    default: 'linear'
  },
  color: String,
})

</script>

<style></style>