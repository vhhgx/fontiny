<template>
  <div name="弹窗组件最外层" class="vhhg-dialogs">

    <div>这里是自定义的弹窗</div>
    {{ title }}
    {{ msg }}

    <!-- <vs-button @click="emit('click')" size="large" border style="margin-top: 40px;">
      <BaseIcons icon="send-2"></BaseIcons>
      开始压缩
    </vs-button> -->

    <button @click="emit('click')">开始压缩</button>

  </div>
</template>

<script setup>
const emit = defineEmits(['click'])
const props = defineProps({
  msg: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '弹窗'
  }
})
</script>

<style lang='sass'>
.vhhg-dialogs
  @apply z-50 absolute top-0 left-0 h-full w-full

</style>