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
import { cn } from '@ui/lib/utils'
import { FileText, Grid3X3, HelpCircle } from 'lucide-vue-next'
/**
 * @description 知识库创建对话框 — 参考百炼，支持类型选择、Embedding 模型、分段策略配置
 * @author Timon
 */
import { computed, reactive, watch } from 'vue'

// ==================== 类型定义 ====================

interface KnowledgeFormData {
  name: string
  description: string
  icon: string
  type: 'unstructured' | 'structured' | 'qa'
  embeddingModel: string
  chunkStrategy: 'auto' | 'custom'
  chunkSize: number
  chunkOverlap: number
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: KnowledgeFormData): void
}>()

// ==================== 配置项 ====================

const iconOptions = ['📄', '🔧', '💬', '📊', '⚖️', '🧠', '📚', '🔬']

const typeOptions = [
  { value: 'unstructured' as const, label: '非结构化文档', description: 'PDF、Word、TXT、Markdown 等文本文件', icon: FileText },
  { value: 'structured' as const, label: '结构化数据', description: 'Excel、CSV、JSON 等结构化表格数据', icon: Grid3X3 },
  { value: 'qa' as const, label: 'Q&A 问答对', description: '问答对格式，适用于 FAQ 场景', icon: HelpCircle },
]

const embeddingModels = [
  { value: 'text-embedding-v3', label: 'text-embedding-v3', provider: '通义千问', dimension: 1024 },
  { value: 'text-embedding-v2', label: 'text-embedding-v2', provider: '通义千问', dimension: 1536 },
  { value: 'bge-large-zh-v1.5', label: 'BGE-Large-ZH', provider: '智源 BAAI', dimension: 1024 },
  { value: 'bge-m3', label: 'BGE-M3', provider: '智源 BAAI', dimension: 1024 },
  { value: 'text-embedding-3-small', label: 'text-embedding-3-small', provider: 'OpenAI', dimension: 1536 },
]

// ==================== 表单状态 ====================

function initialForm(): KnowledgeFormData {
  return {
    name: '',
    description: '',
    icon: '📄',
    type: 'unstructured',
    embeddingModel: 'text-embedding-v3',
    chunkStrategy: 'auto',
    chunkSize: 500,
    chunkOverlap: 50,
  }
}

const form = reactive<KnowledgeFormData>(initialForm())
const isValid = computed(() => form.name.trim() !== '')

/** 当前选中的 Embedding 模型信息 */
const selectedModel = computed(() =>
  embeddingModels.find(m => m.value === form.embeddingModel),
)

watch(() => props.open, (isOpen) => {
  if (isOpen) Object.assign(form, initialForm())
})

// ==================== 事件处理 ====================

function handleSubmit() {
  if (!isValid.value) return
  emit('submit', { ...form })
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle>创建知识库</DialogTitle>
        <DialogDescription>
          新建一个知识库用于存储和检索文档数据，配置 Embedding 模型与分段策略。
        </DialogDescription>
      </DialogHeader>

      <form class="grid gap-5 py-1" @submit.prevent="handleSubmit">
        <!-- 知识库图标 -->
        <div class="grid gap-2">
          <Label>图标</Label>
          <div class="flex items-center gap-2">
            <button
              v-for="icon in iconOptions"
              :key="icon"
              type="button"
              class="flex size-9 items-center justify-center rounded-lg border text-lg transition-all"
              :class="form.icon === icon
                ? 'border-primary bg-primary/10 scale-110'
                : 'border-border/60 hover:border-primary/30 hover:bg-muted/30'"
              @click="form.icon = icon"
            >
              {{ icon }}
            </button>
          </div>
        </div>

        <!-- 知识库名称 -->
        <div class="grid gap-2">
          <Label for="kb-name">
            名称
            <span class="text-destructive">*</span>
          </Label>
          <Input id="kb-name" v-model="form.name" placeholder="例如：产品文档" />
        </div>

        <!-- 描述 -->
        <div class="grid gap-2">
          <Label for="kb-desc">描述</Label>
          <textarea
            id="kb-desc"
            v-model="form.description"
            rows="2"
            placeholder="描述知识库的内容和用途"
            class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
          />
        </div>

        <!-- 知识库类型 -->
        <div class="grid gap-2">
          <Label>数据类型</Label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              type="button"
              :class="cn(
                'flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-center transition-all',
                form.type === opt.value
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border/60 hover:border-primary/30 hover:bg-muted/30',
              )"
              @click="form.type = opt.value"
            >
              <component :is="opt.icon" class="size-5 text-muted-foreground" />
              <span class="text-xs font-medium">{{ opt.label }}</span>
            </button>
          </div>
          <p class="text-xs text-muted-foreground">
            {{ typeOptions.find(t => t.value === form.type)?.description }}
          </p>
        </div>

        <!-- Embedding 模型 -->
        <div class="grid gap-2">
          <Label>Embedding 模型</Label>
          <Select v-model="form.embeddingModel">
            <SelectTrigger>
              <SelectValue placeholder="选择 Embedding 模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="model in embeddingModels"
                :key="model.value"
                :value="model.value"
              >
                <div class="flex items-center gap-2">
                  <span>{{ model.label }}</span>
                  <span class="text-xs text-muted-foreground">{{ model.provider }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="selectedModel" class="text-xs text-muted-foreground">
            向量维度：{{ selectedModel.dimension }} · 提供方：{{ selectedModel.provider }}
          </p>
        </div>

        <!-- 分段策略 -->
        <div class="grid gap-3">
          <Label>分段策略</Label>
          <div class="flex gap-2">
            <button
              type="button"
              :class="cn(
                'flex-1 rounded-lg border px-3 py-2 text-sm transition-all',
                form.chunkStrategy === 'auto'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20 font-medium'
                  : 'border-border/60 hover:border-primary/30 hover:bg-muted/30',
              )"
              @click="form.chunkStrategy = 'auto'"
            >
              智能分段
            </button>
            <button
              type="button"
              :class="cn(
                'flex-1 rounded-lg border px-3 py-2 text-sm transition-all',
                form.chunkStrategy === 'custom'
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20 font-medium'
                  : 'border-border/60 hover:border-primary/30 hover:bg-muted/30',
              )"
              @click="form.chunkStrategy = 'custom'"
            >
              自定义
            </button>
          </div>

          <!-- 自定义分段参数 -->
          <div v-if="form.chunkStrategy === 'custom'" class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <Label for="chunk-size" class="text-xs">
                分段长度 (Token)
              </Label>
              <Input
                id="chunk-size"
                v-model.number="form.chunkSize"
                type="number"
                :min="100"
                :max="2000"
                placeholder="500"
              />
            </div>
            <div class="grid gap-1.5">
              <Label for="chunk-overlap" class="text-xs">
                重叠长度 (Token)
              </Label>
              <Input
                id="chunk-overlap"
                v-model.number="form.chunkOverlap"
                type="number"
                :min="0"
                :max="500"
                placeholder="50"
              />
            </div>
          </div>
          <p class="text-xs text-muted-foreground">
            {{ form.chunkStrategy === 'auto' ? '系统将根据文档格式自动选择最优分段方式' : `每段约 ${form.chunkSize} Token，相邻段重叠 ${form.chunkOverlap} Token` }}
          </p>
        </div>

        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" @click="emit('update:open', false)">
            取消
          </Button>
          <Button type="submit" :disabled="!isValid">
            创建
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
