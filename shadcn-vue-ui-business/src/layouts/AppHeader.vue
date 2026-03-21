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
import { Bell, HelpCircle, LogOut, Moon, Settings, Sun } from 'lucide-vue-next'
/**
 * @description 业务管理后台顶栏 — 产品后台风格
 * @author Timon
 */
import { computed } from 'vue'
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
        Business
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

    <!-- 右：操作 -->
    <div class="ml-auto flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8" aria-label="通知" @click="toast.info('通知', { description: '暂无新通知' })">
            <Bell class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>通知</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8" aria-label="切换主题" @click="toggleTheme">
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
            <AvatarFallback class="bg-primary/10 text-primary text-xs font-medium">
              T
            </AvatarFallback>
          </Avatar>
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
            <DropdownMenuItem @click="toast.info('帮助文档', { description: '帮助文档功能即将上线' })">
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
