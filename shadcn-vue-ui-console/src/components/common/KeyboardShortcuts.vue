<script setup lang="ts">
/**
 * @description 快捷键提示面板 — 按 ? 显示（GitHub/Linear 风格）
 * @author Timon
 */
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@ui/components/ui/dialog'
import { Separator } from '@ui/components/ui/separator'

const open = ref(false)

const shortcuts = [
  {
    group: '全局',
    items: [
      { keys: ['⌘', 'K'], desc: '打开命令面板' },
      { keys: ['?'], desc: '显示快捷键' },
    ],
  },
  {
    group: '导航',
    items: [
      { keys: ['G', '然后', 'H'], desc: '回到首页' },
      { keys: ['G', '然后', 'M'], desc: '模型管理' },
      { keys: ['G', '然后', 'A'], desc: 'Agent 管理' },
      { keys: ['G', '然后', 'S'], desc: '系统设置' },
    ],
  },
  {
    group: '操作',
    items: [
      { keys: ['N'], desc: '新建（当前页面上下文）' },
      { keys: ['Esc'], desc: '关闭弹窗 / 取消' },
    ],
  },
]

function handleKeydown(e: KeyboardEvent) {
  if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>键盘快捷键</DialogTitle>
        <DialogDescription>使用快捷键提升操作效率</DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div v-for="section in shortcuts" :key="section.group">
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {{ section.group }}
          </p>
          <div class="space-y-1">
            <div
              v-for="item in section.items"
              :key="item.desc"
              class="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50"
            >
              <span class="text-sm">{{ item.desc }}</span>
              <div class="flex items-center gap-1">
                <kbd
                  v-for="(key, i) in item.keys"
                  :key="i"
                  :class="key === '然后' ? 'text-[10px] text-muted-foreground px-0' : 'inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium'"
                >
                  {{ key }}
                </kbd>
              </div>
            </div>
          </div>
          <Separator class="mt-3" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
