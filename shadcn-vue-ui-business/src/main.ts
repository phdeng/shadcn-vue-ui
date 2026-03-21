import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/index.css'

const app = createApp(App)

// 全局错误处理 — Vue 组件错误
app.config.errorHandler = (err, _instance, info) => {
  console.error(`[shadcn-vue-ui-business] 组件错误: ${info}`, err)
}

// 全局未处理的 Promise rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('[shadcn-vue-ui-business] 未处理的异步错误:', event.reason)
})

app.use(createPinia())
app.use(router)
app.mount('#app')
