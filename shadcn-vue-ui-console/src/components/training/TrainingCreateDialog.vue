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
/**
 * @description 训练任务创建对话框 — 配置基座模型、数据集与训练参数
 * @author Timon
 */
import { computed, reactive, watch } from 'vue'

interface TrainingFormData {
  name: string
  baseModel: string
  dataset: string
  epochs: number
  learningRate: number
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: TrainingFormData): void
}>()

const modelOptions = [
  { value: 'Qwen2.5-72B', label: 'Qwen2.5-72B' },
  { value: 'DeepSeek-V3', label: 'DeepSeek-V3' },
  { value: 'GPT-4o', label: 'GPT-4o' },
  { value: 'Claude 3.5', label: 'Claude 3.5' },
]

const datasetOptions = [
  { value: '客服对话数据', label: '客服对话数据' },
  { value: '产品文档', label: '产品文档' },
  { value: '代码审查数据', label: '代码审查数据' },
  { value: 'FAQ问答对', label: 'FAQ 问答对' },
  { value: '多轮对话', label: '多轮对话' },
]

function initialForm(): TrainingFormData {
  return { name: '', baseModel: '', dataset: '', epochs: 3, learningRate: 0.0001 }
}

const form = reactive<TrainingFormData>(initialForm())
const isValid = computed(() => form.name.trim() !== '' && form.baseModel !== '' && form.dataset !== '')

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
        <DialogTitle>创建训练任务</DialogTitle>
        <DialogDescription>
          配置微调训练参数，选择基座模型与训练数据集。
        </DialogDescription>
      </DialogHeader>

      <form class="grid gap-5 py-1" @submit.prevent="handleSubmit">
        <!-- 任务名称 -->
        <div class="grid gap-2">
          <Label for="train-name">
            任务名称
            <span class="text-destructive">*</span>
          </Label>
          <Input id="train-name" v-model="form.name" placeholder="例如：客服模型 v2 微调" />
        </div>

        <!-- 基座模型 & 数据集 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="train-model">
              基座模型
              <span class="text-destructive">*</span>
            </Label>
            <Select v-model="form.baseModel">
              <SelectTrigger id="train-model" class="w-full">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in modelOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="train-dataset">
              训练数据集
              <span class="text-destructive">*</span>
            </Label>
            <Select v-model="form.dataset">
              <SelectTrigger id="train-dataset" class="w-full">
                <SelectValue placeholder="选择数据集" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in datasetOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Epochs & Learning Rate -->
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="train-epochs">Epochs</Label>
            <Input id="train-epochs" v-model="form.epochs" type="number" :min="1" :max="100" />
          </div>
          <div class="grid gap-2">
            <Label for="train-lr">Learning Rate</Label>
            <Input id="train-lr" v-model="form.learningRate" type="number" :min="0" :step="0.00001" />
          </div>
        </div>

        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            取消
          </Button>
          <Button type="submit" :disabled="!isValid">
            创建任务
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
