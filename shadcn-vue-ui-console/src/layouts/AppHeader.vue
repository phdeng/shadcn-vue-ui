<script setup lang="ts">
/**
 * @description 控制台顶栏 — 产品控制台风格
 * @author Timon
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Sun, Moon, Search, Bell } from 'lucide-vue-next'
import { SidebarTrigger } from '@ui/components/ui/sidebar'
import { Separator } from '@ui/components/ui/separator'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ui/components/ui/tooltip'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { mode, toggleTheme } = useTheme()

const pageTitle = computed(() => (route.meta?.title as string) || '')
</script>

<template>
  <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
    <!-- 左：侧边栏按钮 + 面包屑 -->
    <SidebarTrigger class="-ml-1 size-7" />
    <Separator orientation="vertical" class="!h-4" />
    <nav class="flex items-center gap-1.5 text-sm">
      <span class="text-muted-foreground">Console</span>
      <span class="text-muted-foreground/50">/</span>
      <span class="font-medium">{{ pageTitle }}</span>
    </nav>

    <!-- 右：搜索 + 操作 -->
    <div class="ml-auto flex items-center gap-2">
      <div class="relative hidden md:block">
        <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="搜索..."
          class="h-8 w-52 rounded-lg bg-muted/50 pl-8 text-xs focus:w-72 transition-all duration-300"
        />
      </div>

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

      <Avatar class="size-7 cursor-pointer">
        <AvatarFallback class="bg-primary/10 text-primary text-xs font-medium">T</AvatarFallback>
      </Avatar>
    </div>
  </header>
</template>
