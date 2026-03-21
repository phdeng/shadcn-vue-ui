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
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'
import { Upload } from 'lucide-vue-next'
/**
 * @description 数据集上传对话框 — 支持文件选择与基本信息配置
 * @author Timon
 */
import { computed, reactive, watch } from 'vue'

interface DatasetFormData {
  name: string
  format: string
  description: string
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: DatasetFormData): void
}>()

const formatOptions = [
  { value: 'jsonl', label: 'JSONL' },
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'txt', label: 'TXT' },
]

function initialForm(): DatasetFormData {
  return { name: '', format: '', description: '' }
}

const form = reactive<DatasetFormData>(initialForm())
const isValid = computed(() => form.name.trim() !== '' && form.format !== '')

watch(() => props.open, (isOpen) => {
  if (isOpen) Object.assign(form, initialForm())
})

function handleSubmit() {
  if (!isValid.value) return
  emit('submit', { ...form })
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>上传数据集</DialogTitle>
        <DialogDescription>
          上传训练数据集文件，支持 JSONL、JSON、CSV、TXT 格式。
        </DialogDescription>
      </DialogHeader>

      <form class="grid gap-5 py-1" @submit.prevent="handleSubmit">
        <!-- 数据集名称 -->
        <div class="grid gap-2">
          <Label for="ds-name">
            数据集名称
            <span class="text-destructive">*</span>
          </Label>
          <Input id="ds-name" v-model="form.name" placeholder="例如：客服对话数据" />
        </div>

        <!-- 文件格式 -->
        <div class="grid gap-2">
          <Label for="ds-format">
            文件格式
            <span class="text-destructive">*</span>
          </Label>
          <Select v-model="form.format">
            <SelectTrigger id="ds-format" class="w-full">
              <SelectValue placeholder="选择格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in formatOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- 文件上传区 -->
        <div class="grid gap-2">
          <Label>上传文件</Label>
          <div class="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 py-8 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted/30">
            <Upload class="size-8 text-muted-foreground/40" />
            <p class="text-sm">
              拖拽文件到此处或点击上传
            </p>
            <p class="text-xs text-muted-foreground/60">
              支持 .jsonl, .json, .csv, .txt，最大 500 MB
            </p>
          </div>
        </div>

        <!-- 描述 -->
        <div class="grid gap-2">
          <Label for="ds-desc">
            描述
            <span class="text-muted-foreground text-xs font-normal">（可选）</span>
          </Label>
          <Input id="ds-desc" v-model="form.description" placeholder="简要描述数据集内容" />
        </div>

        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            取消
          </Button>
          <Button type="submit" :disabled="!isValid">
            上传
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
