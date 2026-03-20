import { createRouter, createWebHistory } from 'vue-router'
import { setupRouteGuards } from './guards'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 注册路由守卫 — 认证拦截 & 标题更新
setupRouteGuards(router)

export default router
