<template>
  <div>
    <div>
      <h2>收到的消息：</h2>
      <ul>
        <li v-for="(message, index) in receivedMessages" :key="index">
          {{ message }}
        </li>
      </ul>
      <h2>发送的消息：</h2>
      <ul>
        <li v-for="(message, index) in sentMessages" :key="index">
          {{ message }}
        </li>
      </ul>
    </div>
    <div>
      <input v-model="messageInput" type="text" placeholder="输入消息" />
      <button @click="sendMessage">发送消息</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      receivedMessages: [],
      sentMessages: [],
      messageInput: '',
      socket: null,
    }
  },
  created() {
    this.initWebSocket()
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close()
    }
  },
  methods: {
    initWebSocket() {
      // 判断是否是浏览器环境
      if (process.browser) {
        this.socket = new WebSocket('ws://localhost:8080/')
      } else {
        this.socket = {}
      }

      this.socket.onopen = (event) => {
        console.log('WebSocket连接已打开')
      }

      this.socket.onmessage = (event) => {
        this.receivedMessages.push(event.data)
      }

      this.socket.onerror = (event) => {
        console.error('WebSocket错误:', event)
      }

      this.socket.onclose = (event) => {
        console.log('WebSocket连接已关闭')
      }
    },
    sendMessage() {
      const message = this.messageInput
      this.sentMessages.push(message)
      this.socket.send(message)
      this.messageInput = ''
    },
  },
}
</script>
