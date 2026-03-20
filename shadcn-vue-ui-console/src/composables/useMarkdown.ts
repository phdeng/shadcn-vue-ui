import DOMPurify from 'dompurify'
import { marked } from 'marked'
/**
 * @description Markdown 渲染 composable — 用于 ChatAgent 消息
 * @author Timon
 */
import { computed } from 'vue'

// 配置 marked — 简洁模式，不生成额外包裹标签
marked.setOptions({
  breaks: true,
  gfm: true,
})

/**
 * 将 Markdown 文本渲染为安全 HTML
 */
export function renderMarkdown(text: string): string {
  const raw = marked.parse(text, { async: false }) as string
  return DOMPurify.sanitize(raw)
}

/**
 * 响应式 Markdown 渲染
 */
export function useMarkdown(getText: () => string) {
  return computed(() => renderMarkdown(getText()))
}
