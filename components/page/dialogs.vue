<template>
  <vs-dialog blur prevent-close v-model="isShowLongText" class="vh-dialog">
    <template #header>
      <div class="mt-2 text-base">{{ title }}</div>
    </template>


    <div class="con-form">
      <slot></slot>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button block @click="onConfirm">确定</vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script setup>
const emit = defineEmits(['confirm'])
const props = defineProps({
  title: String
})

const onConfirm = () => {
  emit('confirm')
}
</script>

<style lang="sass">
.vh-dialog
  .footer-dialog
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
</style>