<template>
  <div class="text-gray-500 pb-3 font-black">
    <i class="iconsax vuesax-linear-user"></i>
    <span class="ml-4">{{ title }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String
})
</script>

<style></style>