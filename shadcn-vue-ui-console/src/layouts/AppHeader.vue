<script setup lang="ts">
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import { Button } from '@ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Separator } from '@ui/components/ui/separator'
import { SidebarTrigger } from '@ui/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ui/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ui/components/ui/popover'
import { Bell, HelpCircle, LogOut, Moon, Search, Settings, Sun } from 'lucide-vue-next'
/**
 * @description 控制台顶栏 — 产品控制台风格
 * @author Timon
 */
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { mode, toggleTheme } = useTheme()
const authStore = useAuthStore()

/** 多级面包屑 — 从路由 matched 链提取 */
const breadcrumbs = computed(() => {
  return route.matched
    .filter(r => r.meta?.title)
    .map(r => ({
      title: r.meta.title as string,
      path: r.path || '/',
      isLast: false,
    }))
    .map((item, i, arr) => ({
      ...item,
      isLast: i === arr.length - 1,
    }))
})

// ==================== 通知数据 ====================

const notifications = ref([
  { id: '1', title: 'DeepSeek-V3 注册成功', desc: '模型已就绪，可以开始调用', time: '5 分钟前', read: false },
  { id: '2', title: '知识库「产品文档」索引完成', desc: '共索引 156 篇文档', time: '18 分钟前', read: false },
  { id: '3', title: 'API 调用量预警', desc: 'GPT-4o 今日调用量已超过阈值 80%', time: '1 小时前', read: true },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function markAllRead() {
  notifications.value.forEach(n => n.read = true)
}

/** 打开命令面板 — 模拟 ⌘K 快捷键触发 */
function openCommandPalette() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
}

/** 退出登录 */
function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
    <!-- 左：侧边栏按钮 + 面包屑 -->
    <SidebarTrigger class="-ml-1 size-7" />
    <Separator orientation="vertical" class="!h-4" />
    <nav class="flex items-center gap-1.5 text-sm">
      <RouterLink to="/" class="text-muted-foreground hover:text-foreground transition-colors">
        Console
      </RouterLink>
      <template v-for="crumb in breadcrumbs" :key="crumb.path">
        <span class="text-muted-foreground/40">/</span>
        <span v-if="crumb.isLast" class="font-medium truncate max-w-[200px]">{{ crumb.title }}</span>
        <RouterLink
          v-else
          :to="crumb.path"
          class="text-muted-foreground hover:text-foreground transition-colors"
        >
          {{ crumb.title }}
        </RouterLink>
      </template>
    </nav>

    <!-- 右：搜索 + 操作 -->
    <div class="ml-auto flex items-center gap-2">
      <!-- 搜索框 — 点击触发 Command Palette -->
      <button
        class="hidden md:flex items-center gap-2 h-8 w-52 rounded-lg border border-border/50 bg-muted/40 px-3 text-xs text-muted-foreground hover:bg-muted/60 transition-colors"
        @click="openCommandPalette"
      >
        <Search class="size-3.5" />
        <span class="flex-1 text-left">搜索...</span>
        <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <Separator orientation="vertical" class="!h-4 hidden md:block" />

      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" size="icon" class="relative size-8" :aria-label="`${unreadCount > 0 ? unreadCount + ' 条未读' : ''}通知`">
            <Bell class="size-4" />
            <span
              v-if="unreadCount > 0"
              aria-hidden="true"
              class="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-medium text-white"
            >
              {{ unreadCount }}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80 p-0" align="end">
          <div class="flex items-center justify-between border-b px-4 py-3">
            <p class="text-sm font-medium">通知</p>
            <button
              v-if="unreadCount > 0"
              class="text-xs text-primary hover:underline"
              @click="markAllRead"
            >
              全部已读
            </button>
          </div>
          <div class="max-h-72 overflow-y-auto">
            <div
              v-for="notif in notifications"
              :key="notif.id"
              class="flex gap-3 border-b border-border/50 px-4 py-3 last:border-0 transition-colors hover:bg-muted/50"
              :class="!notif.read && 'bg-primary/[0.03]'"
            >
              <span
                v-if="!notif.read"
                class="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              />
              <span v-else class="mt-1.5 size-2 shrink-0" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <p class="text-sm leading-snug" :class="!notif.read && 'font-medium'">
                  {{ notif.title }}
                </p>
                <p class="text-xs text-muted-foreground line-clamp-1">
                  {{ notif.desc }}
                </p>
                <p class="text-[10px] text-muted-foreground/60">
                  {{ notif.time }}
                </p>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8" :aria-label="mode === 'dark' ? '切换亮色模式' : '切换暗色模式'" @click="toggleTheme">
            <Sun v-if="mode === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ mode === 'dark' ? '亮色模式' : '暗色模式' }}
        </TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" class="!h-4" />

      <!-- 用户下拉菜单 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8 rounded-full" aria-label="用户菜单">
            <Avatar class="size-7">
              <AvatarFallback class="bg-primary/10 text-primary text-xs font-medium">
                {{ authStore.user?.avatar || authStore.user?.name?.charAt(0) || 'U' }}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
          <!-- 用户信息 -->
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium leading-none">
                {{ authStore.user?.name || '用户' }}
              </p>
              <p class="text-xs leading-none text-muted-foreground">
                {{ authStore.user?.email || '' }}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <!-- 功能菜单 -->
          <DropdownMenuGroup>
            <DropdownMenuItem @click="router.push('/settings')">
              <Settings class="mr-2 size-4" />
              <span>个人设置</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="toast.info('帮助文档', { description: '文档中心即将上线' })">
              <HelpCircle class="mr-2 size-4" />
              <span>帮助文档</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <!-- 退出登录 -->
          <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleLogout">
            <LogOut class="mr-2 size-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
