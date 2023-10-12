<template>
  <!-- <div> -->
  <div class="flex">
    <span>{{ title }}</span>
    <vs-switch :model="switchs">
      <template #off>{{ status.off }}</template>
      <template #on>{{ status.on }}</template>
    </vs-switch>
  </div>
  <!-- </div> -->
</template>

<script setup>
const props = defineProps({
  title: String,
  switchs: Boolean,
  status: {
    type: Object,
    default: { on: '开启', off: '关闭' }
  }
})

// console.log('这里的', props)
</script>

<style></style>