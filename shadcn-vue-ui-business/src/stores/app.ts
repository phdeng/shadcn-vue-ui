import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/**
 * 应用全局状态 — 持久化用户偏好
 * @author Timon
 */
export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态（从 localStorage 恢复）
  const sidebarCollapsed = ref(localStorage.getItem('sidebar_collapsed') === 'true')

  // 持久化到 localStorage
  watch(sidebarCollapsed, (val) => {
    localStorage.setItem('sidebar_collapsed', String(val))
  })

  return { sidebarCollapsed }
})
