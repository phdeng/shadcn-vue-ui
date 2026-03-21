<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
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
import { Switch } from '@ui/components/ui/switch'
import { ArrowLeft } from 'lucide-vue-next'
/**
 * @description 编辑知识库页面 — 参考百炼，基础信息 + 检索配置表单
 * @author Timon
 */
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const kbId = route.params.id as string

// ==================== 表单数据（模拟从 API 加载） ====================

const form = reactive({
  name: '产品文档',
  description: '产品使用手册、API 文档、FAQ、集成指南等核心产品资料，用于 RAG 检索增强生成。',
  icon: '📄',
  // 只读字段
  dataSource: '非结构化数据',
  embeddingModel: 'text-embedding-v3',
  vectorStorage: '内置',
  // 可编辑配置
  multiTurnRewrite: true,
  rerankModel: 'qwen3-rerank',
  vectorTopK: 50,
  keywordTopK: 50,
  similarityThreshold: 0.20,
  maxRecallResults: 5,
})

const iconOptions = ['📄', '🔧', '💬', '📊', '⚖️', '🧠', '📚', '🔬']

const rerankModels = [
  { value: 'qwen3-rerank', label: 'qwen3-rerank' },
  { value: 'gte-rerank-v2', label: 'gte-rerank-v2' },
  { value: 'bge-reranker-v2-m3', label: 'bge-reranker-v2-m3' },
  { value: 'none', label: '不使用 Rerank' },
]

const saving = ref(false)

// ==================== 事件处理 ====================

function handleSave() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    toast.success('知识库配置已保存')
    router.push(`/knowledge/${kbId}`)
  }, 600)
}

function handleCancel() {
  router.push(`/knowledge/${kbId}`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 头部 -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="shrink-0" @click="handleCancel">
        <ArrowLeft class="size-4" />
      </Button>
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">编辑知识库</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">修改知识库基础信息与检索配置</p>
      </div>
    </div>

    <div class="mx-auto w-full max-w-3xl space-y-6">
      <!-- ==================== 基础信息 ==================== -->
      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">基础信息</CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          <!-- 图标 -->
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

          <!-- 名称 -->
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="kb-name">
                名称 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.name.length }} / 20</span>
            </div>
            <Input
              id="kb-name"
              v-model="form.name"
              placeholder="请输入知识库名称"
              :maxlength="20"
            />
          </div>

          <!-- 描述 -->
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="kb-desc">
                描述 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.description.length }} / 200</span>
            </div>
            <textarea
              id="kb-desc"
              v-model="form.description"
              rows="3"
              :maxlength="200"
              placeholder="请输入知识库描述，介绍知识库中包含的内容，描述会用于指导智能体调用知识库"
              class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
            />
          </div>

          <!-- 数据来源（只读） -->
          <div class="grid gap-2">
            <Label>数据来源</Label>
            <p class="text-sm font-medium text-foreground">{{ form.dataSource }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- ==================== 知识库配置 ==================== -->
      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">
            知识库配置 <span class="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- 多轮对话改写 -->
          <div class="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
            <div>
              <p class="text-sm font-medium">多轮对话改写</p>
              <p class="text-xs text-muted-foreground">开启后将对多轮对话的查询进行改写以提升检索效果</p>
            </div>
            <div class="flex items-center gap-2">
              <Switch v-model:checked="form.multiTurnRewrite" />
              <span class="text-xs text-muted-foreground">{{ form.multiTurnRewrite ? '开启' : '关闭' }}</span>
            </div>
          </div>

          <!-- Embedding 模型（只读） -->
          <div class="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
            <p class="text-sm text-muted-foreground">Embedding 模型</p>
            <p class="font-mono text-sm font-medium">{{ form.embeddingModel }}</p>
          </div>

          <!-- Rank 模型 -->
          <div class="grid gap-2">
            <Label>Rank 模型</Label>
            <Select v-model="form.rerankModel">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="m in rerankModels" :key="m.value" :value="m.value">
                  {{ m.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <!-- 初步向量检索 TopK -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-sm">初步向量检索 TopK</Label>
              <Input
                v-model.number="form.vectorTopK"
                type="number"
                :min="10"
                :max="100"
                class="h-8 w-20 text-center text-sm"
              />
            </div>
            <input
              v-model.number="form.vectorTopK"
              type="range"
              :min="10"
              :max="100"
              class="w-full accent-primary h-1.5"
            >
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          <!-- 初步关键词检索 TopK -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-sm">初步关键词检索 TopK</Label>
              <Input
                v-model.number="form.keywordTopK"
                type="number"
                :min="10"
                :max="100"
                class="h-8 w-20 text-center text-sm"
              />
            </div>
            <input
              v-model.number="form.keywordTopK"
              type="range"
              :min="10"
              :max="100"
              class="w-full accent-primary h-1.5"
            >
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          <!-- 相似度阈值 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-sm">相似度阈值</Label>
              <Input
                v-model.number="form.similarityThreshold"
                type="number"
                :min="0.01"
                :max="1"
                :step="0.01"
                class="h-8 w-20 text-center text-sm"
              />
            </div>
            <input
              v-model.number="form.similarityThreshold"
              type="range"
              :min="0.01"
              :max="1"
              :step="0.01"
              class="w-full accent-primary h-1.5"
            >
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>0.01</span>
              <span>1</span>
            </div>
          </div>

          <!-- 最终召回数量 -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label class="text-sm">最终召回最大数量</Label>
              <Input
                v-model.number="form.maxRecallResults"
                type="number"
                :min="1"
                :max="20"
                class="h-8 w-20 text-center text-sm"
              />
            </div>
            <input
              v-model.number="form.maxRecallResults"
              type="range"
              :min="1"
              :max="20"
              class="w-full accent-primary h-1.5"
            >
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <Separator />

          <!-- 向量存储类型（只读） -->
          <div class="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
            <p class="text-sm text-muted-foreground">向量存储类型</p>
            <p class="text-sm font-medium">{{ form.vectorStorage }}</p>
          </div>

          <!-- 知识库规格（信息卡片） -->
          <div class="rounded-lg border bg-muted/20 p-4 space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium">知识库规格</h4>
              <Badge variant="outline" class="text-[11px]">标准版</Badge>
            </div>
            <p class="text-xs text-muted-foreground">
              适合快速实验，完成业务验证，共享计算资源。
            </p>
            <div class="flex items-baseline gap-1">
              <span class="text-xs text-muted-foreground">价格</span>
              <span class="text-lg font-bold text-primary">0.03</span>
              <span class="text-xs text-muted-foreground">元/小时</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 底部操作 -->
      <div class="flex items-center gap-3 pt-2 pb-4">
        <Button :disabled="saving || !form.name.trim()" @click="handleSave">
          {{ saving ? '保存中...' : '保存' }}
        </Button>
        <Button variant="outline" @click="handleCancel">
          取消
        </Button>
      </div>
    </div>
  </div>
</template>
