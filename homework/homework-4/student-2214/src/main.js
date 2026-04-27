import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n/index.js'
import { router } from './router/index.js'
import './style.css'

// 应用只在入口统一挂载插件，避免各页面重复初始化 i18n 或路由。
createApp(App)
  .use(i18n)
  .use(router)
  .mount('#app')
