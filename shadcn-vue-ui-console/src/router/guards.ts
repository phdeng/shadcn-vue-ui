import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * 路由守卫 — 认证拦截 & 页面标题更新
 * @author Timon
 */
export function setupRouteGuards(router: Router) {
  /**
   * 前置守卫：
   * - 需要认证的路由，未登录则跳转到登录页
   * - 已登录用户访问 guest 页面（如登录页），则重定向到首页
   */
  router.beforeEach((to, _from) => {
    const authStore = useAuthStore()

    // 需要认证但未登录 → 跳转登录（检查路由链上任一层是否要求认证）
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !authStore.isAuthenticated) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }

    // 已登录访问 guest 页面（如登录页） → 重定向首页
    if (to.meta.guest && authStore.isAuthenticated) {
      return { path: '/' }
    }

    return true
  })

  /**
   * 后置守卫：更新页面标题
   */
  router.afterEach((to) => {
    const baseTitle = 'shadcn-vue-ui Console'
    const pageTitle = to.meta.title as string | undefined
    document.title = pageTitle ? `${pageTitle} - ${baseTitle}` : baseTitle
  })
}
