<script setup lang="ts">
import { Workflow } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 py-32">
    <div class="relative">
      <Workflow class="size-20 text-primary/20" />
      <div class="absolute inset-0 size-20 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl" />
    </div>
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-bold tracking-tight">工作流编排</h2>
      <p class="text-[13px] text-muted-foreground max-w-md">
        可视化拖拽编排 Agent 工作流，支持 Multi-Agent 协作、条件分支、循环执行等高级能力。
      </p>
      <p class="text-xs text-muted-foreground/60">预计 2026 H2 上线</p>
    </div>
  </div>
</template>
