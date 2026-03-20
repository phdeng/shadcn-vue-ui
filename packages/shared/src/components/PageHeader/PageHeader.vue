<script setup lang="ts">
/**
 * @description 页面头部组件 — 标题 + 描述 + 操作区
 * @author Timon
 */
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-foreground">
        {{ title }}
      </h2>
      <p v-if="description" class="mt-1 text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
