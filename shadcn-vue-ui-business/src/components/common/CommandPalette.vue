<script setup lang="ts">
/**
 * @description 全局命令面板（⌘K）— 快速搜索和跳转
 * @author Timon
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  LayoutDashboard,
  Box,
  Bot,
  BookOpen,
  Store,
  Settings,
  Database,
  Search,
} from 'lucide-vue-next'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@ui/components/ui/command'

const open = ref(false)
const router = useRouter()

// 页面导航命令 — Business 后台
const pageCommands = [
  { label: '概览', icon: LayoutDashboard, path: '/', group: '页面' },
  { label: '用户管理', icon: Bot, path: '/users', group: '页面' },
  { label: '角色管理', icon: Store, path: '/roles', group: '页面' },
  { label: '订单管理', icon: Box, path: '/orders', group: '页面' },
  { label: '内容管理', icon: BookOpen, path: '/content', group: '页面' },
  { label: '数据报表', icon: Database, path: '/reports', group: '页面' },
  { label: '系统设置', icon: Settings, path: '/settings', group: '系统' },
]

// 快捷操作命令
const actionCommands = [
  { label: '新增用户', icon: Bot, path: '/users', group: '操作' },
  { label: '创建订单', icon: Box, path: '/orders', group: '操作' },
  { label: '查看报表', icon: Database, path: '/reports', group: '操作' },
]

function handleSelect(path: string) {
  open.value = false
  router.push(path)
}

// 全局快捷键监听
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="搜索页面、模型、Agent..." />
    <CommandList>
      <CommandEmpty>
        <div class="flex flex-col items-center gap-2 py-4">
          <Search class="size-8 text-muted-foreground/40" />
          <span class="text-sm text-muted-foreground">未找到匹配结果</span>
        </div>
      </CommandEmpty>

      <CommandGroup heading="页面导航">
        <CommandItem
          v-for="cmd in pageCommands.filter(c => c.group === '页面')"
          :key="cmd.path"
          :value="cmd.label"
          @select="handleSelect(cmd.path)"
        >
          <component :is="cmd.icon" class="mr-2 size-4 text-muted-foreground" />
          <span>{{ cmd.label }}</span>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="模型">
        <CommandItem
          v-for="cmd in pageCommands.filter(c => c.group === '模型')"
          :key="cmd.path"
          :value="cmd.label"
          @select="handleSelect(cmd.path)"
        >
          <component :is="cmd.icon" class="mr-2 size-4 text-muted-foreground" />
          <span>{{ cmd.label }}</span>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="快捷操作">
        <CommandItem
          v-for="cmd in actionCommands"
          :key="cmd.label"
          :value="cmd.label"
          @select="handleSelect(cmd.path)"
        >
          <component :is="cmd.icon" class="mr-2 size-4 text-muted-foreground" />
          <span>{{ cmd.label }}</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
