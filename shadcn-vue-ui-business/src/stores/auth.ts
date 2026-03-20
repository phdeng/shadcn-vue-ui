import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * 认证状态管理 — 负责登录/登出、Token 持久化
 * @author Timon
 */
export const useAuthStore = defineStore('auth', () => {
  /** 用户认证凭证 */
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  /** 当前登录用户信息 */
  const user = ref<{
    name: string
    email: string
    role: string
    avatar: string
  } | null>(null)

  /** 是否已认证 */
  const isAuthenticated = computed(() => !!token.value)

  // 初始化：如果 localStorage 中存在 token，恢复模拟用户信息
  if (token.value) {
    user.value = {
      name: 'Timon',
      email: 'timon@example.com',
      role: 'admin',
      avatar: 'T',
    }
  }

  /**
   * 模拟登录 — 校验邮箱和密码，设置 token 与用户信息
   * @param email 邮箱
   * @param password 密码
   * @returns 登录是否成功
   */
  async function login(email: string, password: string): Promise<boolean> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1200))

    // 模拟校验（任意非空密码即可通过）
    if (!email || !password) {
      return false
    }

    // 生成模拟 token
    const mockToken = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`
    token.value = mockToken
    localStorage.setItem('auth_token', mockToken)

    // 根据邮箱生成用户信息
    const name = email.split('@')[0]
    user.value = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role: 'admin',
      avatar: name.charAt(0).toUpperCase(),
    }

    return true
  }

  /**
   * 退出登录 — 清除 token、用户信息及本地存储
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  return { token, user, isAuthenticated, login, logout }
})
