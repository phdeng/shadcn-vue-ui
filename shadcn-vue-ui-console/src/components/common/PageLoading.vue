<script setup lang="ts">
/**
 * @description 页面加载骨架屏 — 卡片列表布局的 Skeleton
 * @author Timon
 */
import { Skeleton } from '@ui/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@ui/components/ui/card'

defineProps<{
  /** 骨架卡片数量 */
  count?: number
  /** 布局列数 */
  cols?: 3 | 4
}>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 标题骨架 -->
    <div class="flex items-end justify-between">
      <div class="space-y-2">
        <Skeleton class="h-8 w-40" />
        <Skeleton class="h-4 w-64" />
      </div>
      <Skeleton class="h-9 w-28" />
    </div>

    <!-- 工具栏骨架 -->
    <div class="flex items-center gap-3">
      <Skeleton class="h-9 w-72" />
      <Skeleton class="h-9 w-48" />
    </div>

    <!-- 卡片骨架 -->
    <div :class="[
      'grid gap-4',
      cols === 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 xl:grid-cols-3',
    ]">
      <Card v-for="i in (count || 6)" :key="i" class="border-0 shadow-sm">
        <CardHeader class="pb-3">
          <div class="flex items-center gap-3">
            <Skeleton class="size-10 rounded-xl" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-28" />
              <Skeleton class="h-3 w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton class="h-3 w-full" />
          <Skeleton class="mt-2 h-3 w-3/4" />
          <div class="mt-4 flex items-center justify-between">
            <Skeleton class="h-5 w-16 rounded-full" />
            <Skeleton class="h-3 w-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
