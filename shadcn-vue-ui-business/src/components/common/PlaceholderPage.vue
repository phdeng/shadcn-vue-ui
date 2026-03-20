<script setup lang="ts">
/**
 * @description 页面占位组件 — 用于尚未开发的模块
 * @author Timon
 */
import { Construction } from 'lucide-vue-next'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-foreground">
        {{ title }}
      </h2>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24">
      <Construction class="size-10 text-muted-foreground/50" />
      <p class="mt-4 text-sm text-muted-foreground">
        模块开发中...
      </p>
    </div>
  </div>
</template>
