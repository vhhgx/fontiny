<template>
  <div class="flex flex-1 px-72 gap-8">
    <div class="w-1/4">
      <vh-cards title="文字信息">
        <template #content>
          <vh-head-two title="文本内容"></vh-head-two>
          <div class="flex flex-1">
            <input type="text" class="vh-input rounded-xl" v-model="compressText" :placeholder="inputHolder">
          </div>
        </template>
      </vh-cards>

      <vh-cards title="配置">
        <template #content>
          <vh-head-two title="压缩设置"></vh-head-two>
          <vh-switch title="增量压缩" switchs="increment"></vh-switch>

          <vh-head-two title="转换设置" class="pt-6"></vh-head-two>
          <vh-switch title="转换为woff" switchs="convertWoff"></vh-switch>
          <vh-switch title="是否缩小woff" switchs="deflate"></vh-switch>
          <vh-switch title="转换为svg" switchs="convertSvg"></vh-switch>
          <vh-switch title="保留ttf信息" switchs="hinting"></vh-switch>

          <vh-head-two title="CSS相关" class="pt-6"></vh-head-two>
          <vh-switch title="开启base64" switchs="toCssBase64"></vh-switch>
          <vh-switch title="使用本地字体" switchs="toCssLocal"></vh-switch>
          <div class="flex mt-2" v-if="sta">
            <input type="text" class="flex vh-input rounded-xl" placeholder="请输入本地字体路径">
          </div>

          <vs-button @click="onLogState" size="large" border style="margin-top: 80px;">开始压缩</vs-button>
        </template>
      </vh-cards>


    </div>
    <div class="w-3/4">
      <vh-cards title="提取内容">
        <template #content>
          <div class="vhhg text-5xl">{{ compressText }}</div>
        </template>
      </vh-cards>
    </div>







    <!-- <vh-cards title="字型提取"></vh-cards>

    <div make="标题" class="my-6">
      <span class="text-2xl font-black">字型提取</span>
    </div>

    <div make="输入框和配置" class=" flex gap-8">


      <div class="w-2/3 rounded-3xl">
        <div class="flex flex-col p-6 bg-white rounded-xl">
          <div class="text-gray-500 pb-4 font-black">
            <i class="iconsax saxlinear-text"></i>

            文本及路径
          </div>
          <div class="flex">
            <vs-input v-model="compressText" class="vhhg-input mr-6" :placeholder="inputHolder">
            </vs-input>

            <span>
              长文本
            </span>

            <vs-switch>
              <template #off>关闭</template>
              <template #on>打开</template>
            </vs-switch>

          </div>

        </div>


        <div class="vhhg text-5xl">{{ compressText }}</div>
      </div>
      <div class="w-1/3 p-6 rounded-3xl">


        


      </div>
    </div> -->
  </div>
</template>

<script setup>
let compressText = useState('cn')
const inputHolder = '请输入要提取的文本，长文本请开启文本框'

// const 
// const increment = ref(false) // 增量压缩
// const convertWoff = ref(false) // 转换为woff
// const deflate = ref(false) // 是否缩小woff
// const convertSvg = ref(false) // 转换为svg
// const hinting = ref(false) // 是否保留ttf信息
// const toCssBase64 = ref(false) // 是否开启base64压缩
// const toCssLocal = ref(false) // 是否使用本地字体

// const onLogState = () => {
//   console.log('111', useState('toCssLocal').value)
// }

const sta = useState('toCssLocal')

</script>


<style lang="sass">
.vh-input
  flex: 1
  width: 100%
  background: rgba(var(--vs-gray-2),1)
  border: 2px solid transparent
  color: rgba(var(--vs-text),1)
  // border-radius: inherit
  padding: 7px 13px 7px 10px
</style>
