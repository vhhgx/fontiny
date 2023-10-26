<template>
  <div>
    <vs-tooltip>
      <i class="iconsax vuesax-linear-user"></i>
      <template #tooltip>{{ text }}</template>
    </vs-tooltip>
  </div>
</template>

<script setup>
const props = defineProps({
  text: String,
  icon: String
})

// let keys = useState(props.switchs)
// useState(props.switchs, () => keys)
</script>

<style></style>