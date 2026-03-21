<script setup lang="ts">
import { Button } from '@ui/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/components/ui/dialog'
import { AlertTriangle } from 'lucide-vue-next'
/**
 * @description 通用确认对话框 — 用于删除、禁用等危险操作的二次确认
 * @author Timon
 */

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  destructive?: boolean
  loading?: boolean
}>(), {
  title: '确认操作',
  description: '此操作不可撤销，确定要继续吗？',
  confirmText: '确认',
  destructive: true,
  loading: false,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Dialog :open="props.open" @update:open="(val: boolean) => emit('update:open', val)">
    <DialogContent class="sm:max-w-[420px]">
      <DialogHeader>
        <div class="flex items-start gap-3">
          <div
            v-if="destructive"
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10"
          >
            <AlertTriangle class="size-5 text-destructive" />
          </div>
          <div>
            <DialogTitle>{{ title }}</DialogTitle>
            <DialogDescription class="mt-1.5">
              {{ description }}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <DialogFooter class="pt-2">
        <Button variant="outline" :disabled="loading" @click="emit('update:open', false)">
          取消
        </Button>
        <Button
          :variant="destructive ? 'destructive' : 'default'"
          :disabled="loading"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
