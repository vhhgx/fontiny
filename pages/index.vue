<template>
  <div class="flex flex-1 px-72 gap-8">
    <div class="w-1/4">
      <vh-page-cards title="文字信息">
        <template #content>
          <vh-tool-head-two title="文本内容" icon="linear-language-square">
            <template #options>
              <div class="select-none cursor-pointer" @click="showLongText">输入长文本</div>
              <PageDialogs title="输入长文本" v-model="isShowLongText" @confirm="closeLongText">
                <textarea type="text" class="vh-input " v-model="compressText" rows="8" />
              </PageDialogs>
            </template>
          </vh-tool-head-two>
          <div class="flex flex-1">
            <input type="text" class="vh-input rounded-xl" v-model="compressText" :placeholder="inputHolder">
          </div>
          <vh-tool-head-two title="文字大小" icon="linear-language-square" class="pt-6">
            <template #options>
              <div class="text-zinc-500">{{ fontSize }}px</div>
            </template>
          </vh-tool-head-two>
          <el-slider v-model="fontSize" :min="36" :max="120" style="--el-color-primary: rgb(25, 91, 255)" />
        </template>
      </vh-page-cards>

      <vh-page-cards title="配置">
        <template #content>
          <vh-tool-head-two title="压缩设置" icon="linear-candle-2">
            <template #options>
              <div class="select-none cursor-pointer" @click="showLongText">设置路径</div>
              <PageDialogs title="输入长文本" v-model="isShowLongText" @confirm="closeLongText">
                <textarea type="text" class="vh-input " v-model="compressText" rows="8" />
              </PageDialogs>
            </template>
          </vh-tool-head-two>
          <vh-tool-switch title="增量压缩" switchs="increment">
            <template #tip>
              <vh-tool-tip text="根据git记录压缩 add 状态的字体文件"></vh-tool-tip>
            </template>
          </vh-tool-switch>

          <vh-tool-head-two title="转换设置" icon="linear-candle-2" class="pt-6"></vh-tool-head-two>
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

          <vh-tool-head-two title="CSS相关" icon="linear-candle-2" class="pt-6"></vh-tool-head-two>
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
          <vs-button @click="onStartCompress" size="large" border style="margin-top: 40px;">
            <BaseIcons icon="send-2"></BaseIcons>
            开始压缩
          </vs-button>
        </template>
      </vh-page-cards>
    </div>
    <div class="w-3/4">
      <vh-page-cards title="示例字体">
        <template #content>
          <div class="flex flex-col gap-4">
            <div v-for="font in exmFonts">
              <PageFonts :fontName="font.name" :icons="font.icons" :fontSize="fontSize" :fontFamily="font.family">
                {{ compressText }}
              </PageFonts>
            </div>
          </div>
        </template>
      </vh-page-cards>
    </div>
  </div>
</template>

<script setup>
// import dialogs from 'components/saxDialog'

// 字型内容
let compressText = useState('cn')
const inputHolder = '请输入要提取的文本，长文本请开启文本框'
// 是否开启本地字体路径
const isLocalPath = useState('toCssLocal')
// 是否缩小woff
const isDeflate = useState('convertWoff')
// 本地字体路径
const fontPath = useState('toCssLoaclPath')

// 实例文字大小
let fontSize = ref(54)

const isShowLongText = ref(false)

// 打开弹窗
const showLongText = () => {
  isShowLongText.value = true
}

const closeLongText = () => {
  isShowLongText.value = false
}

const onStartCompress = () => {
  const { data } = useFetch('/api/compress')
  console.log('data', data)
}

const exmFonts = [
  { name: '优设标题黑', icons: [{ text: '汉语' }, { text: '简体' }, { icon: 'emoji-happy', text: '可免费商用' }], family: 'ysbth' },
  { name: '阿里妈妈刀隶体', icons: [{ icon: 'emoji-happy', text: '可免费商用' }], family: 'daoli' },
  { name: '霞鹜漫黑', icons: [{ text: '汉语' }, { text: '简体' }], family: 'xwmh' },
  { name: '润植家康熙字典', icons: [{ text: '汉语' }, { text: '繁体' }], family: 'kxzd' },
]
</script>


<style lang="sass">
.vh-input
  @apply rounded-xl resize-none
  flex: 1
  width: 100%
  background: rgba(var(--vs-gray-2),1)
  border: 2px solid transparent
  color: rgba(var(--vs-text),1)
  padding: 7px 13px 7px 10px
</style>
