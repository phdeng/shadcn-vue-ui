<script setup lang="ts">
/**
 * @description Agent 创建对话框 — Dify/cloud-console 风格的表单弹窗
 * @author Timon
 */
import { reactive, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@ui/components/ui/dialog'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'

// ---- 类型定义 ----

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

// ---- Props & Emits ----

const props = defineProps<{
  /** 控制对话框开关 */
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: AgentFormData): void
}>()

// ---- 可选模型列表 ----

const modelOptions = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3.5-sonnet' },
  { label: 'DeepSeek-V3', value: 'deepseek-v3' },
  { label: 'Qwen2.5-72B', value: 'qwen2.5-72b' },
] as const

// ---- 头像颜色预设 ----

const avatarColors: { key: AvatarColor; bg: string; ring: string }[] = [
  { key: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-500/40' },
  { key: 'violet', bg: 'bg-violet-500', ring: 'ring-violet-500/40' },
  { key: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500/40' },
  { key: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500/40' },
  { key: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500/40' },
]

// ---- 表单状态 ----

/** 初始表单值 */
const initialForm = (): AgentFormData => ({
  name: '',
  description: '',
  model: '',
  systemPrompt: '',
  tags: '',
  avatarColor: 'blue',
})

const form = reactive<AgentFormData>(initialForm())

/** 对话框打开时重置表单 */
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      Object.assign(form, initialForm())
    }
  },
)

// ---- 校验 ----

/** 表单是否可提交（名称和描述必填） */
const isValid = computed(() => form.name.trim() !== '' && form.description.trim() !== '')

// ---- 事件处理 ----

/** 关闭对话框 */
function handleClose() {
  emit('update:open', false)
}

/** 提交表单 */
function handleSubmit() {
  if (!isValid.value) return
  emit('submit', { ...form })
  handleClose()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <!-- 头部 -->
      <DialogHeader>
        <DialogTitle>创建 Agent</DialogTitle>
        <DialogDescription>
          配置一个新的智能体，设定其名称、模型和行为准则。
        </DialogDescription>
      </DialogHeader>

      <!-- 表单主体 -->
      <form class="grid gap-5 py-1" @submit.prevent="handleSubmit">
        <!-- Agent 名称 -->
        <div class="grid gap-2">
          <Label for="agent-name">
            Agent 名称
            <span class="text-destructive">*</span>
          </Label>
          <Input
            id="agent-name"
            v-model="form.name"
            placeholder="为你的 Agent 命名"
          />
        </div>

        <!-- Agent 描述 -->
        <div class="grid gap-2">
          <Label for="agent-description">
            Agent 描述
            <span class="text-destructive">*</span>
          </Label>
          <textarea
            id="agent-description"
            v-model="form.description"
            rows="2"
            placeholder="描述 Agent 的能力和用途"
            class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <!-- 关联模型 -->
        <div class="grid gap-2">
          <Label for="agent-model">关联模型</Label>
          <Select v-model="form.model">
            <SelectTrigger id="agent-model" class="w-full">
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
        <div class="grid gap-2">
          <Label for="agent-system-prompt">系统提示词</Label>
          <textarea
            id="agent-system-prompt"
            v-model="form.systemPrompt"
            rows="3"
            placeholder="设定 Agent 的角色和行为准则"
            class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <!-- 能力标签 -->
        <div class="grid gap-2">
          <Label for="agent-tags">能力标签</Label>
          <Input
            id="agent-tags"
            v-model="form.tags"
            placeholder="用逗号分隔，如：对话, NLP, RAG"
          />
          <p class="text-xs text-muted-foreground">
            多个标签之间用逗号分隔
          </p>
        </div>

        <!-- 头像颜色 -->
        <div class="grid gap-2">
          <Label>头像颜色</Label>
          <div class="flex items-center gap-2.5">
            <button
              v-for="color in avatarColors"
              :key="color.key"
              type="button"
              :class="[
                'size-7 rounded-full transition-all',
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
      </form>

      <!-- 底部操作 -->
      <DialogFooter>
        <Button variant="outline" @click="handleClose">
          取消
        </Button>
        <Button :disabled="!isValid" @click="handleSubmit">
          创建 Agent
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
