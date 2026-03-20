<script setup lang="ts">
/**
 * @description 统计卡片组件 — 用于 Dashboard 数据展示
 * @author Timon
 */
import type { Component } from 'vue'
import { cn } from '@ui/lib/utils'
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'

defineProps<{
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  description?: string
  icon?: Component
}>()
</script>

<template>
  <div class="rounded-lg border border-border bg-card p-5 shadow-sm">
    <div class="flex items-center justify-between pb-2">
      <span class="text-sm font-medium text-muted-foreground">{{ title }}</span>
      <component :is="icon" v-if="icon" class="size-4 text-muted-foreground" />
    </div>
    <div class="text-2xl font-semibold text-card-foreground">
      {{ value }}
    </div>
    <div v-if="change" class="mt-1 flex items-center gap-1 text-xs">
      <ArrowUpRight v-if="trend === 'up'" class="size-3 text-emerald-500" />
      <ArrowDownRight v-else-if="trend === 'down'" class="size-3 text-destructive" />
      <span :class="cn(trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground')">
        {{ change }}
      </span>
      <span v-if="description" class="text-muted-foreground">{{ description }}</span>
    </div>
  </div>
</template>
