<template>
  <div class="flex">
    <span>{{ title }}</span>
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

// let keys = ref(useState(props.switchs).value)

let keys = useState(props.switchs)

// console.log('keeeeeeeys', keys)
// onComputed()
// let keys = computed(() => {
//   // return
//   // const status = props.switchs

//   console.log('2222222', props.switchs)
//   // console.log('3333333', useState(props.switchs).value)

//   return useState(props.switchs).value

//   // useState('langs')

//   // return per.surname + '~' + per.name
// })




// const testC = () => {
//   // console.log('这里绑定的', keys.value)
useState(props.switchs, () => keys)
//   // console.log('dddddd', useState(props.switchs).value)
// }
</script>

<style></style>