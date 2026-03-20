<script setup lang="ts">
/**
 * @description 页面错误状态组件
 * @author Timon
 */
import { AlertCircle, RotateCcw } from 'lucide-vue-next'
import { Button } from '@ui/components/ui/button'

defineProps<{
  message?: string
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 py-20">
    <div class="flex size-14 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle class="size-7 text-destructive" />
    </div>
    <p class="mt-4 text-sm font-medium text-foreground">
      加载失败
    </p>
    <p class="mt-1 text-xs text-muted-foreground">
      {{ message || '请检查网络连接后重试' }}
    </p>
    <Button variant="outline" size="sm" class="mt-4" @click="emit('retry')">
      <RotateCcw class="mr-2 size-3.5" />
      重试
    </Button>
  </div>
</template>
