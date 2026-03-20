<script setup lang="ts">
/**
 * @description 控制台侧边栏 — 配置驱动导航
 * @author Timon
 */
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
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
import {
  mainNavItems,
  modelNavGroup,
  featureNavItems,
  systemNavItems,
} from '@/config/navigation'

const route = useRoute()
const modelMenuOpen = ref(true)

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function isModelActive() {
  return modelNavGroup.children.some((c) => route.path.startsWith(c.path))
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
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <!-- 主导航 -->
            <SidebarMenuItem v-for="item in mainNavItems" :key="item.path">
              <SidebarMenuButton as-child :is-active="isActive(item.path)" :tooltip="item.title">
                <RouterLink :to="item.path">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <!-- 模型子菜单 -->
            <SidebarMenuItem>
              <SidebarMenuButton
                :is-active="isModelActive()"
                :tooltip="modelNavGroup.title"
                @click="modelMenuOpen = !modelMenuOpen"
              >
                <component :is="modelNavGroup.icon" />
                <span>{{ modelNavGroup.title }}</span>
                <ChevronRight
                  class="ml-auto size-4 transition-transform duration-200"
                  :class="modelMenuOpen && 'rotate-90'"
                />
              </SidebarMenuButton>
              <SidebarMenuSub v-show="modelMenuOpen">
                <SidebarMenuSubItem v-for="child in modelNavGroup.children" :key="child.path">
                  <SidebarMenuSubButton as-child :is-active="isActive(child.path)">
                    <RouterLink :to="child.path">
                      <span>{{ child.title }}</span>
                    </RouterLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <!-- 功能模块 -->
            <SidebarMenuItem v-for="item in featureNavItems" :key="item.path">
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
            <span class="text-muted-foreground">API 调用量</span>
            <span class="text-foreground font-medium tabular-nums">1,847 / 10,000</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div class="h-full rounded-full bg-primary/70" style="width: 18.5%" />
          </div>
          <div class="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>存储 2.1 / 10 GB</span>
            <span>本月</span>
          </div>
        </div>
      </div>

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
