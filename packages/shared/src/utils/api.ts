/**
 * @description 轻量 API 请求封装 — 基于 fetch，支持 Mock Server 和真实 API
 * @author Timon
 */

/** API 基础地址 — 从环境变量读取，默认指向 Mock Server */
const BASE_URL = typeof import.meta !== 'undefined'
  ? (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001'
  : 'http://localhost:3001'

/** 通用请求配置 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

/**
 * 发送 API 请求
 * @param endpoint - 接口路径（如 /models）
 * @param options - 请求配置
 */
export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/** 便捷方法 */
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body: unknown) => request<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
}
