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
 * @description 模型注册对话框 — Dify 风格的模型配置表单弹窗
 * @author Timon
 */
import { reactive, watch } from 'vue'

/** 模型注册表单数据接口 */
interface ModelFormData {
  /** 模型名称 */
  name: string
  /** 提供商 */
  provider: string
  /** 模型类型 */
  modelType: string
  /** API 端点 */
  apiEndpoint: string
  /** 最大 Token 数 */
  maxTokens: number
  /** 采样温度 */
  temperature: number
  /** 模型描述 */
  description: string
}

// ---- Props & Emits ----

const props = defineProps<{
  /** 控制对话框显示/隐藏 */
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: ModelFormData): void
}>()

// ---- 提供商选项 ----
const providerOptions = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'alibaba', label: 'Alibaba' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'google', label: 'Google' },
  { value: 'zhipu', label: 'Zhipu' },
  { value: 'custom', label: '自定义' },
] as const

// ---- 模型类型选项 ----
const modelTypeOptions = [
  { value: 'llm', label: '大语言模型' },
  { value: 'embedding', label: '嵌入模型' },
  { value: 'image', label: '图像生成' },
  { value: 'speech', label: '语音识别' },
] as const

// ---- 表单初始值 ----
function createInitialForm(): ModelFormData {
  return {
    name: '',
    provider: '',
    modelType: '',
    apiEndpoint: '',
    maxTokens: 4096,
    temperature: 0.7,
    description: '',
  }
}

// ---- 表单状态（使用 reactive 统一管理） ----
const formData = reactive<ModelFormData>(createInitialForm())

/** 对话框打开时重置表单 */
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      Object.assign(formData, createInitialForm())
    }
  },
)

// ---- 事件处理 ----

/** 取消操作 */
function handleCancel() {
  emit('update:open', false)
}

/** 提交表单 */
function handleSubmit() {
  // 提交表单数据的浅拷贝，避免外部修改内部状态
  emit('submit', { ...formData })
  emit('update:open', false)
}
</script>

<template>
  <Dialog
    :open="props.open"
    @update:open="(val: boolean) => emit('update:open', val)"
  >
    <DialogContent class="sm:max-w-[520px]">
      <!-- 对话框头部 -->
      <DialogHeader>
        <DialogTitle>注册模型</DialogTitle>
        <DialogDescription>
          添加新的 AI 模型到平台，配置模型基本信息与调用参数。
        </DialogDescription>
      </DialogHeader>

      <!-- 表单主体 -->
      <form class="grid gap-5 py-2" @submit.prevent="handleSubmit">
        <!-- 模型名称 -->
        <div class="grid gap-2">
          <Label for="model-name">
            模型名称
            <span class="text-destructive">*</span>
          </Label>
          <Input
            id="model-name"
            v-model="formData.name"
            placeholder="例如：GPT-4o、Claude 3.5 Sonnet"
            required
          />
        </div>

        <!-- 提供商 & 模型类型（两列布局） -->
        <div class="grid grid-cols-2 gap-4">
          <!-- 提供商 -->
          <div class="grid gap-2">
            <Label for="model-provider">提供商</Label>
            <Select v-model="formData.provider">
              <SelectTrigger id="model-provider" class="w-full">
                <SelectValue placeholder="选择提供商" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in providerOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- 模型类型 -->
          <div class="grid gap-2">
            <Label for="model-type">模型类型</Label>
            <Select v-model="formData.modelType">
              <SelectTrigger id="model-type" class="w-full">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in modelTypeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- API 端点 -->
        <div class="grid gap-2">
          <Label for="api-endpoint">API 端点</Label>
          <Input
            id="api-endpoint"
            v-model="formData.apiEndpoint"
            placeholder="https://api.example.com/v1/chat/completions"
          />
        </div>

        <!-- 最大 Token & Temperature（两列布局） -->
        <div class="grid grid-cols-2 gap-4">
          <!-- 最大 Token -->
          <div class="grid gap-2">
            <Label for="max-tokens">最大 Token</Label>
            <Input
              id="max-tokens"
              v-model="formData.maxTokens"
              type="number"
              :min="1"
              placeholder="4096"
            />
          </div>

          <!-- Temperature -->
          <div class="grid gap-2">
            <Label for="temperature">Temperature</Label>
            <Input
              id="temperature"
              v-model="formData.temperature"
              type="number"
              :min="0"
              :max="2"
              :step="0.1"
              placeholder="0.7"
            />
          </div>
        </div>

        <!-- 模型描述 -->
        <div class="grid gap-2">
          <Label for="model-description">
            模型描述
            <span class="text-muted-foreground text-xs font-normal">（可选）</span>
          </Label>
          <Input
            id="model-description"
            v-model="formData.description"
            placeholder="简要描述模型的能力与适用场景"
          />
        </div>

        <!-- 对话框底部按钮 -->
        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" @click="handleCancel">
            取消
          </Button>
          <Button type="submit" :disabled="!formData.name.trim()">
            提交
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
