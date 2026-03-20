<script setup lang="ts">
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@ui/components/ui/command'
import {
  BookOpen,
  Bot,
  Box,
  Database,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Search,
  Settings,
  Store,
} from 'lucide-vue-next'
/**
 * @description 全局命令面板（⌘K）— 快速搜索和跳转
 * @author Timon
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const open = ref(false)
const router = useRouter()

// 页面导航命令
const pageCommands = [
  { label: '概览', icon: LayoutDashboard, path: '/', group: '页面' },
  { label: '数据集', icon: Database, path: '/datasets', group: '模型' },
  { label: '模型管理', icon: Box, path: '/models', group: '模型' },
  { label: '模型训练', icon: GraduationCap, path: '/training', group: '模型' },
  { label: '知识库', icon: BookOpen, path: '/knowledge', group: '页面' },
  { label: 'Agent 管理', icon: Bot, path: '/agents', group: '页面' },
  { label: '插件市场', icon: Store, path: '/plugins', group: '页面' },
  { label: 'ChatAgent', icon: MessageCircle, path: '/chat', group: '页面' },
  { label: '系统设置', icon: Settings, path: '/settings', group: '系统' },
]

// 快捷操作命令
const actionCommands = [
  { label: '注册新模型', icon: Box, path: '/models', group: '操作' },
  { label: '创建 Agent', icon: Bot, path: '/agents', group: '操作' },
  { label: '上传知识库', icon: BookOpen, path: '/knowledge', group: '操作' },
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
