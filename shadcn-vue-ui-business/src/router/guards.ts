import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import { useAuthStore } from '@/stores/auth'

// NProgress 配置 — 细线进度条，无旋转图标
NProgress.configure({ showSpinner: false, speed: 300, minimum: 0.2 })

/**
 * 路由守卫 — 进度条 + 认证拦截 + 页面标题更新
 * @author Timon
 */
export function setupRouteGuards(router: Router) {
  /**
   * 前置守卫：启动进度条 + 认证校验
   */
  router.beforeEach((to, _from) => {
    NProgress.start()
    const authStore = useAuthStore()

    // 需要认证但未登录 → 跳转登录
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !authStore.isAuthenticated) {
      NProgress.done()
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }

    // 已登录访问 guest 页面 → 重定向首页
    if (to.meta.guest && authStore.isAuthenticated) {
      NProgress.done()
      return { path: '/' }
    }

    return true
  })

  /**
   * 后置守卫：结束进度条 + 更新页面标题
   */
  router.afterEach((to) => {
    NProgress.done()
    const baseTitle = 'shadcn-vue-ui Business'
    const pageTitle = to.meta.title as string | undefined
    document.title = pageTitle ? `${pageTitle} - ${baseTitle}` : baseTitle
  })
}
