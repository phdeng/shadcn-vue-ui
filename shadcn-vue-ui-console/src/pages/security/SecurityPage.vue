<script setup lang="ts">
import { Shield } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 py-32">
    <div class="relative">
      <Shield class="size-20 text-primary/20" />
      <div class="absolute inset-0 size-20 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-2xl" />
    </div>
    <div class="text-center space-y-2">
      <h2 class="text-2xl font-bold tracking-tight">安全合规</h2>
      <p class="text-[13px] text-muted-foreground max-w-md">
        AI 安全护栏、内容审核、审计日志、模型合规标签管理，确保 AI 应用符合监管要求。
      </p>
      <p class="text-xs text-muted-foreground/60">预计 2026 H2 上线</p>
    </div>
  </div>
</template>
