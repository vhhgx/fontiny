<template>
  <div>
    <vs-dialog blur prevent-close class="vh-dialog" v-model="checks">
      <template #header>
        <div class="mt-2 text-base">这里是个标题</div>
      </template>


      <div class="con-form">
        弹窗
      </div>

      <template #footer>
        <div class="footer-dialog">
          <!-- @click="onConfirm" -->
          <vs-button block>确定</vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script setup>
// const emit = defineEmits(['confirm'])
const props = defineProps({
  title: String,
  check: Boolean,
})

console.log('组件里面', props.check)

const checks = ref(props.check)

// const onConfirm = () => {
//   emit('confirm')
// }
</script>

<style lang="sass">
.vh-dialog
  .footer-dialog
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
</style>