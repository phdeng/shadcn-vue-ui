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
 * @description 创建 Agent — 独立页面，从弹窗迁移而来
 * @author Timon
 */
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

// ==================== 类型定义 ====================

/** 头像预设颜色 */
type AvatarColor = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose'

/** 表单数据结构 */
interface AgentFormData {
  name: string
  description: string
  model: string
  systemPrompt: string
  tags: string
  avatarColor: AvatarColor
}

// ==================== 配置项 ====================

/** 可选模型列表 */
const modelOptions = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3.5-sonnet' },
  { label: 'DeepSeek-V3', value: 'deepseek-v3' },
  { label: 'Qwen2.5-72B', value: 'qwen2.5-72b' },
] as const

/** 头像颜色预设 */
const avatarColors: { key: AvatarColor, bg: string, ring: string }[] = [
  { key: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-500/40' },
  { key: 'violet', bg: 'bg-violet-500', ring: 'ring-violet-500/40' },
  { key: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500/40' },
  { key: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500/40' },
  { key: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500/40' },
]

// ==================== 表单状态 ====================

const form = reactive<AgentFormData>({
  name: '',
  description: '',
  model: '',
  systemPrompt: '',
  tags: '',
  avatarColor: 'blue',
})

// ==================== 校验 ====================

/** 表单是否可提交（名称和描述必填） */
const isValid = computed(() => form.name.trim() !== '' && form.description.trim() !== '')

// ==================== 事件处理 ====================

/** 取消 — 返回列表页 */
function handleCancel() {
  router.push('/agents')
}

/** 提交表单 */
function handleSubmit() {
  if (!isValid.value) return
  toast.success('Agent 创建成功', { description: form.name })
  router.push('/agents')
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
        <h2 class="text-2xl font-semibold tracking-tight">创建 Agent</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">配置一个新的智能体，设定其名称、模型和行为准则</p>
      </div>
    </div>

    <!-- 表单内容区 -->
    <div class="mx-auto w-full max-w-3xl">
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">基础配置</CardTitle>
          <CardDescription>设置 Agent 的名称、描述和关联模型</CardDescription>
        </CardHeader>
        <CardContent class="space-y-7">
          <!-- 头像颜色 -->
          <div class="grid gap-2.5">
            <Label class="text-[13px] font-medium">头像颜色</Label>
            <div class="flex items-center gap-2.5">
              <button
                v-for="color in avatarColors"
                :key="color.key"
                type="button"
                class="size-8 rounded-full transition-all"
                :class="[
                  color.bg,
                  form.avatarColor === color.key
                    ? `ring-2 ${color.ring} scale-110`
                    : 'opacity-70 hover:opacity-100 hover:scale-105',
                ]"
                :aria-label="`选择${color.key}色`"
                @click="form.avatarColor = color.key"
              />
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- Agent 名称 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="agent-name" class="text-[13px] font-medium">
                Agent 名称 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.name.length }} / 30</span>
            </div>
            <Input
              id="agent-name"
              v-model="form.name"
              placeholder="为你的 Agent 命名"
              :maxlength="30"
              class="h-10 rounded-xl"
            />
          </div>

          <!-- Agent 描述 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="agent-description" class="text-[13px] font-medium">
                Agent 描述 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.description.length }} / 200</span>
            </div>
            <textarea
              id="agent-description"
              v-model="form.description"
              rows="3"
              :maxlength="200"
              placeholder="描述 Agent 的能力和用途"
              class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- 关联模型 -->
          <div class="grid gap-2.5">
            <Label for="agent-model" class="text-[13px] font-medium">关联模型</Label>
            <Select v-model="form.model">
              <SelectTrigger id="agent-model" class="h-10 rounded-xl">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in modelOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- 系统提示词 -->
          <div class="grid gap-2.5">
            <Label for="agent-system-prompt" class="text-[13px] font-medium">系统提示词</Label>
            <textarea
              id="agent-system-prompt"
              v-model="form.systemPrompt"
              rows="4"
              placeholder="设定 Agent 的角色和行为准则"
              class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- 能力标签 -->
          <div class="grid gap-2.5">
            <Label for="agent-tags" class="text-[13px] font-medium">能力标签</Label>
            <Input
              id="agent-tags"
              v-model="form.tags"
              placeholder="用逗号分隔，如：对话, NLP, RAG"
              class="h-10 rounded-xl"
            />
            <p class="text-xs text-muted-foreground">
              多个标签之间用逗号分隔
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between pt-6 pb-2">
        <Button variant="outline" @click="handleCancel">
          取消
        </Button>
        <Button :disabled="!isValid" @click="handleSubmit">
          创建 Agent
        </Button>
      </div>
    </div>
  </div>
</template>
