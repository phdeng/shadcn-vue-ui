<script setup lang="ts">
/**
 * @description 控制台顶栏
 * @author Timon
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Sun, Moon } from 'lucide-vue-next'
import { SidebarTrigger } from '@ui/components/ui/sidebar'
import { Separator } from '@ui/components/ui/separator'
import { Button } from '@ui/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ui/components/ui/tooltip'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { mode, toggleTheme } = useTheme()

const pageTitle = computed(() => {
  return (route.meta?.title as string) || ''
})
</script>

<template>
  <header class="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 px-4 backdrop-blur-sm">
    <SidebarTrigger class="-ml-1 size-7" />
    <Separator orientation="vertical" class="mr-2 !h-4" />

    <span class="text-sm font-medium">{{ pageTitle }}</span>

    <div class="ml-auto flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8" @click="toggleTheme">
            <Sun v-if="mode === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {{ mode === 'dark' ? '切换至亮色模式' : '切换至暗色模式' }}
        </TooltipContent>
      </Tooltip>
    </div>
  </header>
</template>
