<script setup lang="ts">
/**
 * @description 控制台侧边栏 — 导航菜单
 * @author Timon
 */
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Box,
  Database,
  GraduationCap,
  BookOpen,
  Bot,
  Store,
  MessageCircle,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarRail,
} from '@ui/components/ui/sidebar'

const route = useRoute()

// 模型子菜单展开状态
const modelMenuOpen = ref(true)

// 主导航
const mainNav = [
  { title: '概览', icon: LayoutDashboard, path: '/' },
]

// 模型子菜单
const modelNav = {
  title: '模型',
  icon: Box,
  children: [
    { title: '数据集', path: '/datasets' },
    { title: '模型管理', path: '/models' },
    { title: '模型训练', path: '/training' },
  ],
}

// 功能导航
const featureNav = [
  { title: '知识库', icon: BookOpen, path: '/knowledge' },
  { title: 'Agent 管理', icon: Bot, path: '/agents' },
  { title: '插件市场', icon: Store, path: '/plugins' },
  { title: 'ChatAgent', icon: MessageCircle, path: '/chat' },
]

// 系统导航
const systemNav = [
  { title: '系统设置', icon: Settings, path: '/settings' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function isModelActive() {
  return modelNav.children.some((c) => route.path.startsWith(c.path))
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
              <span class="truncate text-xs text-muted-foreground">Console</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <!-- 概览 -->
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in mainNav" :key="item.path">
              <SidebarMenuButton as-child :is-active="isActive(item.path)" :tooltip="item.title">
                <RouterLink :to="item.path">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <!-- 模型（可折叠子菜单） -->
            <SidebarMenuItem>
              <SidebarMenuButton
                :is-active="isModelActive()"
                :tooltip="modelNav.title"
                @click="modelMenuOpen = !modelMenuOpen"
              >
                <component :is="modelNav.icon" />
                <span>{{ modelNav.title }}</span>
                <ChevronRight
                  class="ml-auto size-4 transition-transform duration-200"
                  :class="modelMenuOpen && 'rotate-90'"
                />
              </SidebarMenuButton>
              <SidebarMenuSub v-show="modelMenuOpen">
                <SidebarMenuSubItem v-for="child in modelNav.children" :key="child.path">
                  <SidebarMenuSubButton as-child :is-active="isActive(child.path)">
                    <RouterLink :to="child.path">
                      <span>{{ child.title }}</span>
                    </RouterLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <!-- 功能模块 -->
            <SidebarMenuItem v-for="item in featureNav" :key="item.path">
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
            <SidebarMenuItem v-for="item in systemNav" :key="item.path">
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

    <!-- 底部用户 -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div class="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium">
              T
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">Timon</span>
              <span class="truncate text-xs text-muted-foreground">管理员</span>
            </div>
            <ChevronDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
