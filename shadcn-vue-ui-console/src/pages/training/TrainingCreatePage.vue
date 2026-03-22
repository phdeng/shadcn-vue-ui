<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
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
import { Separator } from '@ui/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Layers,
  Sparkles,
} from 'lucide-vue-next'
/**
 * @description 创建训练任务 — 三步引导页面
 * 步骤：① 选择基座模型 → ② 选择数据集 → ③ 配置超参数
 * @author Timon
 */
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

// ==================== 步骤控制 ====================

const currentStep = ref(1)
const steps = [
  { num: 1, label: '选择基座模型' },
  { num: 2, label: '选择数据集' },
  { num: 3, label: '配置超参数' },
]

// ==================== 表单数据 ====================

interface FormData {
  // 步骤 1：基座模型
  baseModel: string
  // 步骤 2：数据集
  datasetId: string
  // 步骤 3：超参数
  method: 'SFT' | 'DPO' | 'CPT'
  learningRate: number
  batchSize: number
  epochs: number
  warmupSteps: number
  taskName: string
}

const form = reactive<FormData>({
  baseModel: '',
  datasetId: '',
  method: 'SFT',
  learningRate: 0.0001,
  batchSize: 8,
  epochs: 3,
  warmupSteps: 100,
  taskName: '',
})

// ==================== 配置项 ====================

const baseModels = [
  { value: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', params: '200B+', description: '最强多模态模型，支持文本/图像/音频' },
  { value: 'claude-3.5', name: 'Claude 3.5', provider: 'Anthropic', params: '175B+', description: '强推理能力，擅长长文本与代码生成' },
  { value: 'qwen2.5-72b', name: 'Qwen2.5-72B', provider: '通义千问', params: '72B', description: '中文优化，多语言高性能开源模型' },
  { value: 'deepseek-v3', name: 'DeepSeek-V3', provider: 'DeepSeek', params: '671B MoE', description: 'MoE 架构，代码与数学推理领先' },
]

const datasets = [
  { id: 'ds-1', name: '客服对话数据', records: 12500, format: 'JSONL', status: 'processed' as const },
  { id: 'ds-2', name: '代码审查数据', records: 8200, format: 'JSONL', status: 'processed' as const },
  { id: 'ds-3', name: '产品文档', records: 3400, format: 'Parquet', status: 'processed' as const },
  { id: 'ds-4', name: 'FAQ 问答对', records: 5600, format: 'JSONL', status: 'processed' as const },
  { id: 'ds-5', name: '多轮对话', records: 9100, format: 'JSONL', status: 'processed' as const },
]

const trainingMethods = [
  { value: 'SFT' as const, label: 'SFT (监督微调)', description: '使用标注数据进行监督学习，最常见的微调方式' },
  { value: 'DPO' as const, label: 'DPO (直接偏好优化)', description: '基于人类偏好对齐，无需额外奖励模型' },
  { value: 'CPT' as const, label: 'CPT (持续预训练)', description: '在特定领域语料上继续预训练，增强领域知识' },
]

// ==================== 校验 ====================

const step1Valid = computed(() => form.baseModel !== '')
const step2Valid = computed(() => form.datasetId !== '')
const step3Valid = computed(() => form.taskName.trim() !== '')

const canNext = computed(() => {
  if (currentStep.value === 1) return step1Valid.value
  if (currentStep.value === 2) return step2Valid.value
  return true
})

const canSubmit = computed(() => step3Valid.value)

// ==================== 辅助 ====================

const selectedModel = computed(() => baseModels.find(m => m.value === form.baseModel))
const selectedDataset = computed(() => datasets.find(d => d.id === form.datasetId))

// ==================== 导航 ====================

function handleNext() {
  if (!canNext.value) return
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function handleSubmit() {
  if (!canSubmit.value) return
  toast.success('训练任务已创建', { description: form.taskName })
  router.push('/training')
}

function handleCancel() {
  router.push('/training')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 面包屑 + 标题 -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="shrink-0" @click="handleCancel">
        <ArrowLeft class="size-4" />
      </Button>
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">创建训练任务</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">选择基座模型与数据集，配置训练参数后提交任务</p>
      </div>
    </div>

    <!-- 步骤条 -->
    <div class="flex items-center justify-center gap-0">
      <template v-for="(step, index) in steps" :key="step.num">
        <div class="flex items-center gap-2.5">
          <div
            :class="cn(
              'flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
              currentStep === step.num
                ? 'bg-primary text-primary-foreground ring-4 ring-primary/10'
                : currentStep > step.num
                  ? 'bg-success/15 text-success'
                  : 'bg-muted text-muted-foreground',
            )"
          >
            <Check v-if="currentStep > step.num" class="size-3.5" />
            <span v-else>{{ step.num }}</span>
          </div>
          <span
            :class="cn(
              'text-sm font-medium',
              currentStep === step.num ? 'text-foreground' : 'text-muted-foreground',
            )"
          >
            {{ step.label }}
          </span>
        </div>
        <div
          v-if="index < steps.length - 1"
          :class="cn(
            'mx-4 h-px w-20 transition-colors',
            currentStep > step.num ? 'bg-success/30' : 'bg-border/60',
          )"
        />
      </template>
    </div>

    <!-- 步骤内容区 -->
    <div class="mx-auto w-full max-w-3xl">

      <!-- ==================== 步骤 1：选择基座模型 ==================== -->
      <Card v-if="currentStep === 1" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">选择基座模型</CardTitle>
          <CardDescription>选择用于微调训练的基座大语言模型</CardDescription>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="model in baseModels"
              :key="model.value"
              type="button"
              :class="cn(
                'flex items-start gap-3 rounded-xl border p-5 text-left transition-all',
                form.baseModel === model.value
                  ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                  : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
              )"
              @click="form.baseModel = model.value"
            >
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm">
                <Sparkles class="size-4 text-muted-foreground" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ model.name }}</span>
                  <div
                    v-if="form.baseModel === model.value"
                    class="size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check class="size-2.5 text-primary-foreground" />
                  </div>
                </div>
                <div class="mt-1 flex items-center gap-2">
                  <Badge variant="outline" class="text-[10px] tracking-wide">{{ model.provider }}</Badge>
                  <span class="text-[11px] text-muted-foreground font-mono">{{ model.params }}</span>
                </div>
                <p class="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {{ model.description }}
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- ==================== 步骤 2：选择数据集 ==================== -->
      <Card v-if="currentStep === 2" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">选择数据集</CardTitle>
          <CardDescription>从已处理的数据集中选择用于训练的数据</CardDescription>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="grid gap-3">
            <button
              v-for="ds in datasets"
              :key="ds.id"
              type="button"
              :class="cn(
                'flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all',
                form.datasetId === ds.id
                  ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                  : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
              )"
              @click="form.datasetId = ds.id"
            >
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm">
                <Database class="size-4 text-muted-foreground" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ ds.name }}</span>
                  <div
                    v-if="form.datasetId === ds.id"
                    class="size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check class="size-2.5 text-primary-foreground" />
                  </div>
                </div>
                <div class="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span class="tabular-nums">{{ ds.records.toLocaleString() }} 条记录</span>
                  <span>{{ ds.format }}</span>
                </div>
              </div>
              <Badge variant="secondary" class="shrink-0 text-[10px] bg-success/10 text-success border-0">
                已处理
              </Badge>
            </button>
          </div>

          <!-- 已选汇总 -->
          <div v-if="selectedDataset" class="flex items-center gap-2 rounded-xl bg-muted/30 px-5 py-4">
            <span class="text-xs text-muted-foreground">已选择：</span>
            <Badge variant="secondary" class="text-[10px] tracking-wide">
              {{ selectedDataset.name }}
            </Badge>
            <span class="text-xs text-muted-foreground">·</span>
            <span class="text-xs text-muted-foreground tabular-nums">{{ selectedDataset.records.toLocaleString() }} 条</span>
          </div>
        </CardContent>
      </Card>

      <!-- ==================== 步骤 3：配置超参数 ==================== -->
      <Card v-if="currentStep === 3" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">配置超参数</CardTitle>
          <CardDescription>设置训练方式与超参数配置</CardDescription>
        </CardHeader>
        <CardContent class="space-y-7">
          <!-- 任务名称 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="task-name" class="text-[13px] font-medium">
                任务名称 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.taskName.length }} / 40</span>
            </div>
            <Input
              id="task-name"
              v-model="form.taskName"
              placeholder="请输入训练任务名称"
              :maxlength="40"
              class="h-10 rounded-xl"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- 训练方式 -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">训练方式</Label>
            <div class="grid gap-3 sm:grid-cols-3">
              <button
                v-for="m in trainingMethods"
                :key="m.value"
                type="button"
                :class="cn(
                  'rounded-xl border p-4 text-left transition-all',
                  form.method === m.value
                    ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                    : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
                )"
                @click="form.method = m.value"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ m.value }}</span>
                  <div
                    v-if="form.method === m.value"
                    class="size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check class="size-2.5 text-primary-foreground" />
                  </div>
                </div>
                <p class="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                  {{ m.description }}
                </p>
              </button>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- 超参数表单 -->
          <div class="grid grid-cols-2 gap-5">
            <div class="grid gap-2.5">
              <Label for="learning-rate" class="text-[13px] font-medium">学习率 (Learning Rate)</Label>
              <Input
                id="learning-rate"
                v-model.number="form.learningRate"
                type="number"
                step="0.00001"
                :min="0.000001"
                :max="0.01"
                class="h-10 rounded-xl font-mono"
              />
            </div>
            <div class="grid gap-2.5">
              <Label for="batch-size" class="text-[13px] font-medium">Batch Size</Label>
              <Input
                id="batch-size"
                v-model.number="form.batchSize"
                type="number"
                :min="1"
                :max="128"
                class="h-10 rounded-xl font-mono"
              />
            </div>
            <div class="grid gap-2.5">
              <Label for="epochs" class="text-[13px] font-medium">Epochs</Label>
              <Input
                id="epochs"
                v-model.number="form.epochs"
                type="number"
                :min="1"
                :max="50"
                class="h-10 rounded-xl font-mono"
              />
            </div>
            <div class="grid gap-2.5">
              <Label for="warmup-steps" class="text-[13px] font-medium">Warmup Steps</Label>
              <Input
                id="warmup-steps"
                v-model.number="form.warmupSteps"
                type="number"
                :min="0"
                :max="10000"
                class="h-10 rounded-xl font-mono"
              />
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- 创建预览 -->
          <div class="rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 p-5 space-y-4">
            <h4 class="text-[15px] font-medium">创建预览</h4>
            <div class="grid gap-3 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">任务名称</span>
                <span class="font-medium">{{ form.taskName || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">基座模型</span>
                <span class="font-medium">{{ selectedModel?.name || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">数据集</span>
                <span class="font-medium">{{ selectedDataset?.name || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">训练方式</span>
                <span class="font-medium">{{ form.method }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">超参数</span>
                <span class="font-mono font-medium">LR={{ form.learningRate }} · BS={{ form.batchSize }} · EP={{ form.epochs }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between pt-6 pb-2">
        <Button variant="outline" @click="handleCancel">
          取消
        </Button>
        <div class="flex items-center gap-3">
          <Button v-if="currentStep > 1" variant="outline" @click="handlePrev">
            <ArrowLeft class="mr-2 size-4" />
            上一步
          </Button>
          <Button v-if="currentStep < 3" :disabled="!canNext" @click="handleNext">
            下一步
            <ArrowRight class="ml-2 size-4" />
          </Button>
          <Button v-if="currentStep === 3" :disabled="!canSubmit" @click="handleSubmit">
            <Check class="mr-2 size-4" />
            提交训练任务
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
