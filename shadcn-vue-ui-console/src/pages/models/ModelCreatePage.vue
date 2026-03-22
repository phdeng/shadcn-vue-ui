<script setup lang="ts">
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'
import { Separator } from '@ui/components/ui/separator'
import { ArrowLeft } from 'lucide-vue-next'
/**
 * @description 注册模型 — 独立创建页面（从弹窗迁移）
 * 参考 KnowledgeCreatePage 精致风格，单步表单
 * @author Timon
 */
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

// ==================== 表单数据 ====================

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

const formData = reactive<ModelFormData>({
  name: '',
  provider: '',
  modelType: '',
  apiEndpoint: '',
  maxTokens: 4096,
  temperature: 0.7,
  description: '',
})

// ==================== 配置项 ====================

/** 提供商选项 */
const providerOptions = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'alibaba', label: 'Alibaba' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'google', label: 'Google' },
  { value: 'zhipu', label: 'Zhipu' },
  { value: 'custom', label: '自定义' },
] as const

/** 模型类型选项 */
const modelTypeOptions = [
  { value: 'llm', label: '大语言模型' },
  { value: 'embedding', label: '嵌入模型' },
  { value: 'image', label: '图像生成' },
  { value: 'speech', label: '语音识别' },
] as const

// ==================== 事件处理 ====================

/** 取消操作，返回模型列表 */
function handleCancel() {
  router.push('/models')
}

/** 提交表单 */
function handleSubmit() {
  toast.success('模型注册成功', { description: formData.name })
  router.push('/models')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 返回按钮 + 面包屑标题 -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="shrink-0" @click="handleCancel">
        <ArrowLeft class="size-4" />
      </Button>
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">注册模型</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">添加新的 AI 模型到平台，配置模型基本信息与调用参数</p>
      </div>
    </div>

    <!-- 表单内容区 -->
    <div class="mx-auto w-full max-w-3xl">
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">模型信息</CardTitle>
          <CardDescription>填写模型的基本配置与调用参数</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-7" @submit.prevent="handleSubmit">
            <!-- 模型名称 -->
            <div class="grid gap-2.5">
              <Label for="model-name" class="text-[13px] font-medium">
                模型名称 <span class="text-destructive">*</span>
              </Label>
              <Input
                id="model-name"
                v-model="formData.name"
                placeholder="例如：GPT-4o、Claude 3.5 Sonnet"
                required
                class="h-10 rounded-xl"
              />
            </div>

            <!-- 提供商 & 模型类型（两列布局） -->
            <div class="grid grid-cols-2 gap-4">
              <!-- 提供商 -->
              <div class="grid gap-2.5">
                <Label for="model-provider" class="text-[13px] font-medium">提供商</Label>
                <Select v-model="formData.provider">
                  <SelectTrigger id="model-provider" class="h-10 w-full rounded-xl">
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
              <div class="grid gap-2.5">
                <Label for="model-type" class="text-[13px] font-medium">模型类型</Label>
                <Select v-model="formData.modelType">
                  <SelectTrigger id="model-type" class="h-10 w-full rounded-xl">
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

            <Separator class="!bg-border/40" />

            <!-- API 端点 -->
            <div class="grid gap-2.5">
              <Label for="api-endpoint" class="text-[13px] font-medium">API 端点</Label>
              <Input
                id="api-endpoint"
                v-model="formData.apiEndpoint"
                placeholder="https://api.example.com/v1/chat/completions"
                class="h-10 rounded-xl"
              />
            </div>

            <!-- 最大 Token & Temperature（两列布局） -->
            <div class="grid grid-cols-2 gap-4">
              <!-- 最大 Token -->
              <div class="grid gap-2.5">
                <Label for="max-tokens" class="text-[13px] font-medium">最大 Token</Label>
                <Input
                  id="max-tokens"
                  v-model="formData.maxTokens"
                  type="number"
                  :min="1"
                  placeholder="4096"
                  class="h-10 rounded-xl"
                />
              </div>

              <!-- Temperature -->
              <div class="grid gap-2.5">
                <Label for="temperature" class="text-[13px] font-medium">Temperature</Label>
                <Input
                  id="temperature"
                  v-model="formData.temperature"
                  type="number"
                  :min="0"
                  :max="2"
                  :step="0.1"
                  placeholder="0.7"
                  class="h-10 rounded-xl"
                />
              </div>
            </div>

            <Separator class="!bg-border/40" />

            <!-- 模型描述 -->
            <div class="grid gap-2.5">
              <Label for="model-description" class="text-[13px] font-medium">
                模型描述
                <span class="text-muted-foreground text-xs font-normal">（可选）</span>
              </Label>
              <textarea
                id="model-description"
                v-model="formData.description"
                rows="3"
                placeholder="简要描述模型的能力与适用场景"
                class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
              />
            </div>

            <!-- 底部操作栏 -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" @click="handleCancel">
                取消
              </Button>
              <Button type="submit" :disabled="!formData.name.trim()">
                注册模型
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
