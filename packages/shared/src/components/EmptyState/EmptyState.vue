<script setup lang="ts">
/**
 * @description 空状态组件 — 无数据时的友好提示
 * @author Timon
 */
import type { Component } from 'vue'
import { Inbox } from 'lucide-vue-next'

defineProps<{
  icon?: Component
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
    <component
      :is="icon || Inbox"
      class="size-10 text-muted-foreground/40"
    />
    <p v-if="title" class="mt-4 text-sm font-medium text-foreground">
      {{ title }}
    </p>
    <p v-if="description" class="mt-1 text-xs text-muted-foreground">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
