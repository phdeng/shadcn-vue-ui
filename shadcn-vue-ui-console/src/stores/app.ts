import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 应用全局状态
 * @author Timon
 */
export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { sidebarCollapsed, toggleSidebar }
})
