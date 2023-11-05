<template>
  <div class="flex flex-1 px-72 gap-8">
    <div class="w-1/4">
      <PageCards title="文字信息">
        <template #content>
          <PageForms :formList="textOptionsList"></PageForms>
        </template>
      </PageCards>
      <PageCards title="配置">
        <template #content>
          <PageForms :formList="optionsList"></PageForms>

          <vs-button
            @click="sendMessage"
            size="large"
            border
            style="margin-top: 40px">
            <BaseIcons icon="send-2"></BaseIcons>
            开始压缩
          </vs-button>
        </template>
      </PageCards>
    </div>
    <div class="w-3/4">
      <PageCards title="示例字体">
        <template #content>
          <div class="flex flex-col gap-4">
            <div v-for="font in exmFonts">
              <PageFonts
                :fontName="font.name"
                :icons="font.icons"
                :fontSize="fontSize"
                :fontFamily="font.family">
                {{ compressText }}
              </PageFonts>
            </div>
          </div>
        </template>
      </PageCards>
    </div>
  </div>
</template>

<script setup>
let compressText = useState('cn') // 字型内容
let fontSize = ref(54) // 实例文字大小

const { $socket } = useNuxtApp()

// 连接WebSocket
const connectWebSocket = () => {
  $socket.onopen = () => {
    console.log('WebSocket 连接成功')
  }

  $socket.onmessage = (event) => {
    console.log('收到消息：', event.data)
  }

  $socket.onerror = (error) => {
    console.error('WebSocket 连接错误：', error)
  }

  $socket.onclose = () => {
    console.log('WebSocket 连接关闭')
  }
}

onMounted(connectWebSocket)

// 执行压缩命令
const sendMessage = async () => {
  // const { data: testt } = await useFetch('/api/test')
  // console.log('返回方法', testt)
}

// 示例字体
const exmFonts = [
  {
    name: '优设标题黑',
    icons: [
      { text: '汉语' },
      { text: '简体' },
      { icon: 'emoji-happy', text: '可免费商用' },
    ],
    family: 'ysbth',
  },
  {
    name: '阿里妈妈刀隶体',
    icons: [{ icon: 'emoji-happy', text: '可免费商用' }],
    family: 'daoli',
  },
  {
    name: '霞鹜漫黑',
    icons: [{ text: '汉语' }, { text: '简体' }],
    family: 'xwmh',
  },
  {
    name: '润植家康熙字典',
    icons: [{ text: '汉语' }, { text: '繁体' }],
    family: 'kxzd',
  },
]

// 压缩配置
const optionsList = reactive([
  {
    groupName: '压缩设置',
    groupIcon: 'candle-2',
    groupSlot: {
      type: 'button',
      text: '',
    },
    items: [
      {
        title: '增量压缩',
        type: 'switch',
        tip: '压缩Git暂存区的字体文件，关闭则为全量压缩',
        isFull: false,
        options: {
          bind: useState('increment'),
        },
      },
      {
        title: '转换为woff',
        type: 'switch',
        tip: '默认仅生成Woff2，开启则生成Woff同时优化体积',
        isFull: false,
        options: {
          bind: useState('convertWoff'),
        },
      },
      {
        title: '转换为svg',
        type: 'switch',
        tip: '是否生成SVG文件',
        isFull: false,
        options: {
          bind: useState('convertSvg'),
        },
      },
      {
        title: '保留ttf信息',
        type: 'switch',
        tip: '保证在低分辨率设备上小号字体也清晰可读',
        isFull: false,
        options: {
          bind: useState('hinting'),
        },
      },
    ],
  },
  {
    groupName: 'CSS设置',
    groupIcon: 'css3',
    groupSlot: {
      type: 'button',
      text: '',
    },
    items: [
      {
        title: '转换为base64',
        type: 'switch',
        tip: '将压缩后的字型base64存入css文件',
        isFull: false,
        options: {
          bind: useState('toCssBase64'),
        },
      },
      {
        title: '使用本地字体',
        type: 'switch',
        tip: 'css引入字体的路径，默认为本地，如需公网访问请填写公网地址',
        isFull: false,
        options: {
          bind: useState('toCssLocal'),
        },
      },
      {
        title: '使用本地字体',
        type: 'input',
        isFull: true,
        options: {
          bind: useState('toCssLoaclPath'),
          linked: true,
          linkedState: useState('toCssLocal'),
          holder: '请输入本地字体路径',
        },
      },
    ],
  },
])

// 文字相关内容
const textOptionsList = reactive([
  {
    groupName: '文本内容',
    groupIcon: 'language-square',
    groupSlot: {
      type: 'button',
      text: '',
    },
    items: [
      {
        type: 'input',
        isFull: true,
        options: {
          bind: compressText,
          holder: '请输入要提取的文本，点击右侧输入长文本',
        },
      },
    ],
  },
  {
    groupName: '文字大小',
    groupIcon: 'language-square',
    groupSlot: {
      type: 'button',
      text: '',
    },
    items: [
      {
        title: '转换为base64',
        type: 'slider',
        tip: '将压缩后的字型base64存入css文件',
        isFull: true,
        options: {
          bind: fontSize,
        },
      },
    ],
  },
])
</script>

<style lang="sass"></style>
