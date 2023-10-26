<template>
  <div class="flex flex-1 px-72 gap-8">
    <div class="w-1/4">
      <vh-page-cards title="文字信息">
        <template #content>
          <vh-tool-head-two title="文本内容"></vh-tool-head-two>
          <div class="flex flex-1">
            <input type="text" class="vh-input rounded-xl" v-model="compressText" :placeholder="inputHolder">
          </div>
        </template>
      </vh-page-cards>

      <vh-page-cards title="配置">
        <template #content>
          <vh-tool-head-two title="压缩设置"></vh-tool-head-two>
          <vh-tool-switch title="增量压缩" switchs="increment">
            <template #tip>
              <vh-tool-tip text="根据git记录压缩 add 状态的字体文件"></vh-tool-tip>
            </template>
          </vh-tool-switch>

          <vh-tool-head-two title="转换设置" class="pt-6"></vh-tool-head-two>
          <vh-tool-switch title="转换为woff" switchs="convertWoff">
            <template #tip>
              <vh-tool-tip text="默认转换为woff2，按需开启woff"></vh-tool-tip>
            </template>
          </vh-tool-switch>
          <vh-tool-switch title="是否缩小woff" switchs="deflate" v-if="isDeflate">
            <template #tip>
              <vh-tool-tip text="优化woff体积"></vh-tool-tip>
            </template>
          </vh-tool-switch>
          <vh-tool-switch title="转换为svg" switchs="convertSvg"></vh-tool-switch>
          <vh-tool-switch title="保留ttf信息" switchs="hinting">
            <template #tip>
              <vh-tool-tip text="保证在低分辨率设备上小字号字体也清晰可读"></vh-tool-tip>
            </template>
          </vh-tool-switch>

          <vh-tool-head-two title="CSS相关" class="pt-6"></vh-tool-head-two>
          <vh-tool-switch title="开启base64" switchs="toCssBase64">
            <template #tip>
              <vh-tool-tip text="将需要压缩字型的base64存入css文件"></vh-tool-tip>
            </template>
          </vh-tool-switch>
          <vh-tool-switch title="使用本地字体" switchs="toCssLocal">
            <template #tip>
              <vh-tool-tip text="css文件引入文件路径"></vh-tool-tip>
            </template>
          </vh-tool-switch>
          <div class="flex mt-2" v-if="isLocalPath">
            <input type="text" class="flex vh-input rounded-xl" v-model="fontPath" placeholder="请输入本地字体路径">
          </div>
          <vs-button size="large" border style="margin-top: 80px;">开始压缩</vs-button>
        </template>
      </vh-page-cards>
    </div>
    <div class="w-3/4">
      <vh-page-cards title="提取内容">
        <template #content>
          <div class="vhhg text-5xl">{{ compressText }}</div>
        </template>
      </vh-page-cards>
    </div>
  </div>
</template>

<script setup>
// 字型内容
let compressText = useState('cn')
const inputHolder = '请输入要提取的文本，长文本请开启文本框'
// 是否开启本地字体路径
const isLocalPath = useState('toCssLocal')
// 是否缩小woff
const isDeflate = useState('convertWoff')
// 本地字体路径
const fontPath = useState('toCssLoaclPath')
</script>


<style lang="sass">
.vh-input
  flex: 1
  width: 100%
  background: rgba(var(--vs-gray-2),1)
  border: 2px solid transparent
  color: rgba(var(--vs-text),1)
  padding: 7px 13px 7px 10px
</style>
