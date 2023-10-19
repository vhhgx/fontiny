<template>
  <div class="flex flex-col flex-1 px-60">
    <div make="标题" class="my-6">
      <span class="text-2xl font-black">字型提取</span>

    </div>

    <div make="输入框和配置" class=" flex gap-8">


      <div class="w-2/3 bg-neutral-400 p-6 rounded-3xl">
        <!-- <vs-input></vs-input> -->
        <vs-button @click="onLogState">压缩</vs-button>
      </div>
      <div class="w-1/3 bg-neutral-400 p-6 rounded-3xl">


        压缩设置
        <vh-switch title="增量压缩" switchs="increment"></vh-switch>

        转换的目录

        转换设置
        <vh-switch title="转换为woff" switchs="convertWoff"></vh-switch>
        <vh-switch title="是否缩小woff" switchs="deflate"></vh-switch>
        <vh-switch title="转换为svg" switchs="convertSvg"></vh-switch>
        <vh-switch title="保留ttf信息" switchs="hinting"></vh-switch>

        CSS
        <vh-switch title="开启base64" switchs="toCssBase64"></vh-switch>
        <vh-switch title="使用本地字体" switchs="toCssLocal"></vh-switch>
        <input type="text" placeholder="本地字体路径，一般为可访问的公网路径">


      </div>
    </div>
  </div>
</template>

<script setup>
// const increment = ref(false) // 增量压缩
// const convertWoff = ref(false) // 转换为woff
// const deflate = ref(false) // 是否缩小woff
// const convertSvg = ref(false) // 转换为svg
// const hinting = ref(false) // 是否保留ttf信息
// const toCssBase64 = ref(false) // 是否开启base64压缩
// const toCssLocal = ref(false) // 是否使用本地字体

const onLogState = () => {
  console.log('111', useState('increment').value)
}
</script>

<style></style>
