<script setup lang="ts">
/**
 * @description 简易分页组件 — 上一页/下一页 + 页码
 * @author Timon
 */
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@ui/components/ui/button'

const props = withDefaults(defineProps<{
  total: number
  pageSize?: number
  currentPage: number
}>(), {
  pageSize: 10,
})

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center gap-1">
    <Button
      variant="ghost"
      size="icon"
      class="size-8"
      :disabled="currentPage <= 1"
      @click="emit('update:currentPage', currentPage - 1)"
    >
      <ChevronLeft class="size-4" />
    </Button>

    <Button
      v-for="page in visiblePages"
      :key="page"
      :variant="page === currentPage ? 'default' : 'ghost'"
      size="icon"
      class="size-8 text-xs"
      @click="emit('update:currentPage', page)"
    >
      {{ page }}
    </Button>

    <Button
      variant="ghost"
      size="icon"
      class="size-8"
      :disabled="currentPage >= totalPages"
      @click="emit('update:currentPage', currentPage + 1)"
    >
      <ChevronRight class="size-4" />
    </Button>

    <span class="ml-2 text-xs text-muted-foreground">
      共 {{ total }} 条
    </span>
  </div>
</template>
