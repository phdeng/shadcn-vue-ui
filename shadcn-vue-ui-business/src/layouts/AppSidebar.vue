<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@ui/components/ui/sidebar'
import {
  BarChart3,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Settings,
  Shield,
  ShoppingCart,
  Users,
} from 'lucide-vue-next'
/**
 * @description 业务管理后台侧边栏 — 扁平导航结构
 * @author Timon
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// 用户信息 — 从 Auth Store 动态读取
const userAvatar = computed(() => authStore.user?.avatar || authStore.user?.name?.charAt(0) || 'U')
const userName = computed(() => authStore.user?.name || '用户')
const userRole = computed(() => authStore.user?.role === 'admin' ? '管理员' : '成员')

// 主导航项
const mainNavItems = [
  { title: '概览', path: '/', icon: LayoutDashboard },
  { title: '用户管理', path: '/users', icon: Users },
  { title: '角色管理', path: '/roles', icon: Shield },
  { title: '订单管理', path: '/orders', icon: ShoppingCart },
  { title: '内容管理', path: '/content', icon: FileText },
  { title: '数据报表', path: '/reports', icon: BarChart3 },
]

// 系统导航项
const systemNavItems = [
  { title: '系统设置', path: '/settings', icon: Settings },
]

function isActive(path: string) {
  if (path === '/')
    return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <Sidebar collapsible="icon">
    <!-- Logo -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as="a" href="/">
            <div class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              S
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">shadcn-vue-ui</span>
              <span class="truncate text-xs text-muted-foreground">Business</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <!-- 主导航 -->
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in mainNavItems" :key="item.path">
              <SidebarMenuButton as-child :is-active="isActive(item.path)" :tooltip="item.title">
                <RouterLink :to="item.path">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- 系统 -->
      <SidebarGroup>
        <SidebarGroupLabel>系统</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in systemNavItems" :key="item.path">
              <SidebarMenuButton as-child :is-active="isActive(item.path)" :tooltip="item.title">
                <RouterLink :to="item.path">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- 底部：配额 + 用户 -->
    <SidebarFooter>
      <!-- 配额用量指示 -->
      <div class="px-3 pb-2">
        <div class="rounded-lg bg-muted/50 p-3 space-y-2">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-muted-foreground">订单处理量</span>
            <span class="text-foreground font-medium tabular-nums">326 / 5,000</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div class="h-full rounded-full bg-primary/70" style="width: 6.5%" />
          </div>
          <div class="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>用户 1,024</span>
            <span>本月</span>
          </div>
        </div>
      </div>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
              {{ userAvatar }}
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ userName }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ userRole }}</span>
            </div>
            <ChevronDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
