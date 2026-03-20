<script setup lang="ts">
/**
 * @description 控制台顶栏 — 产品控制台风格
 * @author Timon
 */
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Sun, Moon, Search, Bell, Settings, HelpCircle, LogOut } from 'lucide-vue-next'
import { SidebarTrigger } from '@ui/components/ui/sidebar'
import { Separator } from '@ui/components/ui/separator'
import { Button } from '@ui/components/ui/button'
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ui/components/ui/tooltip'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const { mode, toggleTheme } = useTheme()
const authStore = useAuthStore()

const pageTitle = computed(() => (route.meta?.title as string) || '')

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
      <span class="text-muted-foreground/50">/</span>
      <span class="font-medium">{{ pageTitle }}</span>
    </nav>

    <!-- 右：搜索 + 操作 -->
    <div class="ml-auto flex items-center gap-2">
      <!-- 搜索框 — 点击触发 Command Palette -->
      <button
        class="hidden md:flex items-center gap-2 h-8 w-52 rounded-lg border border-border/50 bg-muted/40 px-3 text-xs text-muted-foreground hover:bg-muted/60 transition-colors"
        @click="$emit('openCommand')"
      >
        <Search class="size-3.5" />
        <span class="flex-1 text-left">搜索...</span>
        <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <Separator orientation="vertical" class="!h-4 hidden md:block" />

      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8">
            <Bell class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>通知</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8" @click="toggleTheme">
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
          <Avatar class="size-7 cursor-pointer">
            <AvatarFallback class="bg-primary/10 text-primary text-xs font-medium">T</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
          <!-- 用户信息 -->
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium leading-none">{{ authStore.user?.name || '用户' }}</p>
              <p class="text-xs leading-none text-muted-foreground">{{ authStore.user?.email || '' }}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <!-- 功能菜单 -->
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings class="mr-2 size-4" />
              <span>个人设置</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
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
