import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/index.css'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, _instance, info) => {
  console.error(`[shadcn-vue-ui] 全局错误: ${info}`, err)
}

app.use(createPinia())
app.use(router)
app.mount('#app')
