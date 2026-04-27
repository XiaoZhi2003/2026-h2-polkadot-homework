import { createRouter, createWebHashHistory } from 'vue-router'

// 使用懒加载路由，首屏只加载仪表盘相关代码，其他页面访问时再加载。
const routes = [
  { path: '/',         name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
  { path: '/deploy',   name: 'deploy',    component: () => import('@/views/DeployView.vue') },
  { path: '/interact', name: 'interact',  component: () => import('@/views/InteractView.vue') },
  { path: '/transfer', name: 'transfer',  component: () => import('@/views/TransferView.vue') },
  { path: '/:any(.*)', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 切换页面时回到顶部，避免移动端从上一页的滚动位置进入新页面。
  scrollBehavior: () => ({ top: 0 }),
})
