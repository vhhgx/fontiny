<template>
  <div class="flex justify-between content-center py-1">
    <div class="text-base text-zinc-700">{{ title }}</div>
    <vs-switch v-model="keys">
      <template #off>{{ status.off }}</template>
      <template #on>{{ status.on }}</template>
    </vs-switch>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  switchs: String,
  status: {
    type: Object,
    default: { on: '开启', off: '关闭' }
  }
})

let keys = useState(props.switchs)
useState(props.switchs, () => keys)
</script>

<style></style>