/**
 * @description 模型数据 composable — 演示 Mock Server API 接入模式
 * @author Timon
 *
 * 使用方式：
 * - Mock 模式（默认）：直接使用内联 mock 数据，无需启动 mock server
 * - API 模式：启动 `yarn mock` 后，将 USE_API 改为 true
 *
 * 这是一个示范模块，展示如何从静态 mock 迁移到 API 数据获取。
 * 其他页面可以参考此模式进行 API 接入。
 */
import { ref } from 'vue'
import type { ModelItem } from '@/mocks/models'
import { mockModels } from '@/mocks'

/** 是否使用 API 模式（设为 true 需要先 yarn mock 启动 Mock Server） */
const USE_API = false

/** API 基础地址 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

/**
 * 获取模型列表
 */
export function useModels() {
  const models = ref<ModelItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchModels() {
    loading.value = true
    error.value = null

    try {
      if (USE_API) {
        // API 模式 — 从 Mock Server 获取
        const response = await fetch(`${API_BASE}/models`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        models.value = await response.json()
      } else {
        // Mock 模式 — 使用内联数据（模拟网络延迟）
        await new Promise(resolve => setTimeout(resolve, 300))
        models.value = [...mockModels]
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取模型列表失败'
    } finally {
      loading.value = false
    }
  }

  return { models, loading, error, fetchModels }
}
