/**
 * useRequest — 基于 Fetch API 的轻量级请求组合式函数
 *
 * 提供统一的异步请求状态管理，包含 loading、error、data 三态追踪。
 * 支持泛型推导、立即执行、手动触发与刷新。
 *
 * @author Timon
 * @module @shadcn-vue-ui/shared/composables
 */

import { ref, type Ref } from 'vue'

/** useRequest 配置项 */
export interface UseRequestOptions {
  /** 是否在创建时立即执行请求，默认 false */
  immediate?: boolean
}

/** useRequest 返回值类型 */
export interface UseRequestReturn<T> {
  /** 请求返回的数据，初始为 null */
  data: Ref<T | null>
  /** 是否正在加载中 */
  loading: Ref<boolean>
  /** 错误信息，无错误时为 null */
  error: Ref<string | null>
  /** 手动执行请求 */
  execute: () => Promise<void>
  /** 刷新数据（execute 的别名） */
  refresh: () => Promise<void>
}

/**
 * 轻量级请求组合式函数
 *
 * @param fetcher - 返回 Promise 的异步请求函数
 * @param options - 配置项
 * @returns 包含 data、loading、error、execute、refresh 的响应式对象
 *
 * @example
 * ```ts
 * const { data, loading, error, execute } = useRequest(
 *   () => fetch('/api/models').then(res => res.json()),
 *   { immediate: true }
 * )
 * ```
 */
export function useRequest<T>(
  fetcher: () => Promise<T>,
  options: UseRequestOptions = {},
): UseRequestReturn<T> {
  const { immediate = false } = options

  /** 响应数据 */
  const data = ref<T | null>(null) as Ref<T | null>
  /** 加载状态 */
  const loading = ref(false)
  /** 错误信息 */
  const error = ref<string | null>(null)

  /**
   * 执行请求
   * 自动管理 loading 与 error 状态，请求成功后更新 data
   */
  async function execute(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const result = await fetcher()
      data.value = result
    } catch (err: unknown) {
      // 统一提取错误信息
      if (err instanceof Error) {
        error.value = err.message
      } else if (typeof err === 'string') {
        error.value = err
      } else {
        error.value = '请求失败，发生未知错误'
      }
    } finally {
      loading.value = false
    }
  }

  /** 刷新数据 — execute 的语义化别名 */
  const refresh = execute

  // 若配置了立即执行，则在组合式函数创建时自动发起请求
  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh,
  }
}
