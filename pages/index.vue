<template>
  <div class="flex flex-1 px-72 gap-8">
    <div
      v-if="isExtractify"
      class="absolute top-0 left-0 h-full w-full flex items-center justify-center"
      style="
        z-index: 9999;
        background-color: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(12px);
      ">
      <div
        class="rounded-2xl bg-slate-50 flex"
        style="width: 850px; height: 500px">
        <img
          src="https://images.unsplash.com/photo-1698907432487-f99fa6a91c0f?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Df"
          class="rounded-l-2xl"
          style="object-fit: cover; aspect-ratio: 9/16; height: 100%" />

        <div class="flex flex-1 p-16">
          <div class="flex flex-col justify-between">
            <div v-if="!isFinish">
              <div class="loader mt-6">
                <div class="loading-atom">
                  <div class="loading-animation-item item-1"></div>
                  <div class="loading-animation-item item-2"></div>
                  <div class="loading-animation-item item-3"></div>
                </div>
              </div>

              <div class="text-xl my-4 mt-16" style="color: rgb(25, 91, 255)">
                正在处理 {{ wsContent.msg.name }}
              </div>

              <div class="text-zinc-400 flex flex-col gap-1">
                <span>{{ wsContent.msg.path }}</span>
                <span>
                  共
                  <span class="font-bold">{{ wsContent.msg.count }}</span>
                  个文件，当前第
                  <span class="font-bold">{{ wsContent.msg.curIdx }}</span> 个
                </span>
              </div>
            </div>

            <div v-if="isFinish">
              <div class="w-20 h-20 mt-6">
                <BaseIcons
                  icon="shield-tick"
                  size="80"
                  color="#195BFF"></BaseIcons>
              </div>

              <div class="text-xl my-4 mt-16" style="color: rgb(25, 91, 255)">
                处理完成
              </div>

              <div class="text-zinc-400 flex gap-1">
                共<span class="font-bold">{{ wsContent.msg.count }}</span
                >个文件
                <span class="ml-2">
                  <a
                    class="text-blue-600 hover:text-blue-500 opacity-90"
                    href="#"
                    >查看日志</a
                  >
                </span>
              </div>
            </div>

            <vs-button
              v-if="isFinish"
              @click="onCloseLoading"
              style="margin: 0"
              type="transparent">
              <BaseIcons icon="tick-circle"></BaseIcons>
              确定
            </vs-button>
          </div>
        </div>
      </div>
    </div>
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
            @click="onStartCompress"
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
            <div v-for="font in examples">
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
import { config } from '../compress.config'
import { examples } from '../texts'

const isExtractify = ref(false) // 是否正在压缩，控制弹窗
const isFinish = ref(false) //是否压缩完成
let compressText = useState('cn') // 字型内容
let fontSize = ref(54) // 实例文字大小

const wsContent = reactive({}) // 等待文字

const { $socket } = useNuxtApp()

// 连接WebSocket
const connectWebSocket = () => {
  $socket.onopen = () => {
    console.log('WebSocket 连接成功')
  }

  $socket.onmessage = (event) => {
    let recevied = JSON.parse(event.data)
    wsContent.msg = recevied.msg

    if (recevied.code === 210) {
      isFinish.value = true
    }
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
const onStartCompress = async () => {
  // NOTE 这里要先执行上面的校验
  isFinish.value = false
  isExtractify.value = true
  const msg = { task: true, msg: config }
  $socket.send(JSON.stringify(msg))
}

const onCloseLoading = () => {
  isExtractify.value = false
}

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

<style>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 80px;
  height: 80px;
  position: relative;
}

.loading-atom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.loading-animation-item {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.item-1 {
  left: 0;
  top: 0;
  animation: rotate-atom-one 1s linear infinite;
  border-bottom: 3px solid rgb(25, 91, 255);
}

.item-2 {
  right: 0;
  top: 0;
  animation: rotate-atom-two 1s linear infinite;
  border-right: 3px solid rgb(25, 91, 255);
}

.item-3 {
  right: 0;
  bottom: 0;
  animation: rotate-atom-three 1s linear infinite;
  border-top: 3px solid rgb(25, 91, 255);
}
</style>

<style>
@keyframes rotate-atom-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotate(0);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotate(360deg);
  }
}

@keyframes rotate-atom-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotate(0);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotate(360deg);
  }
}

@keyframes rotate-atom-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotate(0);
  }

  100% {
    transform: rotateX(35deg) rotateY(55deg) rotate(360deg);
  }
}
</style>
