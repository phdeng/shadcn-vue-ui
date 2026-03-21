/**
 * @description Markdown 渲染 composable — 懒加载 marked + DOMPurify
 * 首次调用时动态导入，减少 ChatAgentPage 首屏 JS 体积
 * @author Timon
 */
import { computed } from 'vue'

// 懒加载缓存
let _marked: typeof import('marked').marked | null = null
let _purify: typeof import('dompurify').default | null = null
let _loadPromise: Promise<void> | null = null

/** 确保 marked + DOMPurify 已加载 */
async function ensureLoaded() {
  if (_marked && _purify) return
  if (!_loadPromise) {
    _loadPromise = Promise.all([
      import('marked'),
      import('dompurify'),
    ]).then(([markedModule, purifyModule]) => {
      _marked = markedModule.marked
      _purify = purifyModule.default
      _marked.setOptions({ breaks: true, gfm: true })
    })
  }
  await _loadPromise
}

// 预加载（页面空闲时触发）
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(() => ensureLoaded())
} else {
  setTimeout(() => ensureLoaded(), 100)
}

/**
 * 将 Markdown 文本渲染为安全 HTML
 * 如果库尚未加载完成，返回纯文本
 */
export function renderMarkdown(text: string): string {
  if (!_marked || !_purify) return text
  const raw = _marked.parse(text, { async: false }) as string
  return _purify.sanitize(raw)
}

/**
 * 响应式 Markdown 渲染
 */
export function useMarkdown(getText: () => string) {
  return computed(() => renderMarkdown(getText()))
}
